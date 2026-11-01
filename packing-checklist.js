(() => {
    const panel = document.querySelector("#more-panel");
    if (!panel || typeof packingData === "undefined") return;

    const section = document.createElement("section");
    section.id = "packing-checklist";
    section.className = "more-section packing-section";
    section.dataset.moreSection = "packing";
    panel.appendChild(section);

    let activeTraveler = "sanghun";
    let persistenceAvailable = true;
    const localFallback = new Map();

    const make = (tag, className, value) => {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (value !== undefined) element.textContent = value;
        return element;
    };

    const keyFor = (travelerId, itemId) =>
        "honeymoon-packing-v1:" + travelerId + ":" + itemId;

    const readChecked = (key) => {
        if (localFallback.has(key)) return localFallback.get(key);
        try {
            return window.localStorage.getItem(key) === "true";
        } catch (error) {
            persistenceAvailable = false;
            return false;
        }
    };

    const writeChecked = (key, checked) => {
        localFallback.set(key, checked);
        try {
            window.localStorage.setItem(key, String(checked));
        } catch (error) {
            persistenceAvailable = false;
        }
    };

    const intro = make("div", "packing-lead");
    intro.appendChild(make("strong", "", "여름옷 중심 + 선선한 가을 겉옷 + 방수 재킷"));
    intro.appendChild(make("p", "", "1월 17~29일 시드니·뉴질랜드 일정 기준. 1인 의류 수량은 여행 중 1~2회 세탁을 가정한 추천량입니다. 여행 직전 기상예보에 따라 조절하세요."));
    section.appendChild(intro);

    section.appendChild(make("div", "subsection-heading")).appendChild(
        make("h3", "", "지역별 옷차림")
    );
    const climates = make("div", "packing-climate");
    packingData.climate.forEach((item) => {
        const article = make("article");
        article.appendChild(make("span", "", item.dates));
        article.appendChild(make("strong", "", item.clothing));
        article.appendChild(make("p", "", item.region));
        article.appendChild(make("small", "", item.note));
        climates.appendChild(article);
    });
    section.appendChild(climates);

    const reminderHeading = make("div", "subsection-heading");
    reminderHeading.appendChild(make("h3", "", "일정별 필수 준비"));
    section.appendChild(reminderHeading);
    const tips = make("div", "packing-tips");
    packingData.reminders.forEach((item) => {
        const row = make("div", "packing-tip");
        row.appendChild(make("span", "", item.date));
        row.appendChild(make("strong", "", item.title));
        row.appendChild(make("p", "", item.note));
        tips.appendChild(row);
    });
    section.appendChild(tips);

    const checklistHeading = make("div", "subsection-heading");
    checklistHeading.appendChild(make("h3", "", "짐싸기 체크리스트"));
    checklistHeading.appendChild(make("span", "", "두 사람 + 공용"));
    section.appendChild(checklistHeading);

    const travelers = make("div", "packing-travelers");
    travelers.setAttribute("role", "group");
    travelers.setAttribute("aria-label", "준비물 담당 선택");
    section.appendChild(travelers);

    const progress = make("div", "packing-progress");
    progress.setAttribute("role", "status");
    progress.setAttribute("aria-live", "polite");
    section.appendChild(progress);

    const itemList = make("div", "packing-item-list");
    section.appendChild(itemList);

    const storageNotice = make("p", "packing-storage-note");
    section.appendChild(storageNotice);

    const updateProgress = () => {
        const categories = packingData.categories.filter((category) =>
            (activeTraveler === "shared") === (category.scope === "shared")
        );
        const items = categories.flatMap((category) => category.items);
        const completed = items.filter((item) =>
            readChecked(keyFor(activeTraveler, item.id))
        ).length;
        const percent = items.length ? Math.round(completed / items.length * 100) : 0;
        progress.replaceChildren();
        const line = make("div", "packing-progress-line");
        line.appendChild(make("strong", "", "준비 완료 " + completed + " / " + items.length));
        line.appendChild(make("span", "", percent + "%"));
        progress.appendChild(line);
        const track = make("div", "packing-progress-track");
        const fill = make("div");
        fill.style.width = percent + "%";
        track.appendChild(fill);
        progress.appendChild(track);
        storageNotice.textContent = persistenceAvailable
            ? "체크 상태는 이 기기의 브라우저에만 저장됩니다. 다른 휴대폰·PC와 자동 동기화되지 않으며, 브라우저 데이터 삭제 시 초기화될 수 있습니다."
            : "현재 브라우저에서는 체크 상태를 영구 저장할 수 없습니다. 이 페이지를 닫으면 체크가 사라질 수 있습니다.";
    };

    const renderItems = () => {
        itemList.replaceChildren();
        const scope = activeTraveler === "shared" ? "shared" : "personal";
        packingData.categories.filter((category) => category.scope === scope)
            .forEach((category) => {
                const group = make("section", "packing-group");
                group.appendChild(make("h4", "", category.title));
                category.items.forEach((item) => {
                    const key = keyFor(activeTraveler, item.id);
                    const row = make("label", "packing-row");
                    const checkbox = make("input");
                    checkbox.type = "checkbox";
                    checkbox.checked = readChecked(key);
                    const details = make("span", "packing-row__body");
                    details.appendChild(make("strong", "", item.name));
                    if (item.note) details.appendChild(make("small", "", item.note));
                    row.appendChild(checkbox);
                    row.appendChild(details);
                    row.appendChild(make("span", "packing-row__qty", item.quantity));
                    checkbox.addEventListener("change", () => {
                        writeChecked(key, checkbox.checked);
                        updateProgress();
                    });
                    group.appendChild(row);
                });
                itemList.appendChild(group);
            });
        updateProgress();
    };

    const renderTravelerButtons = () => {
        travelers.replaceChildren();
        packingData.travelers.forEach((person) => {
            const button = make("button", "", person.name);
            button.type = "button";
            button.setAttribute("aria-pressed", String(person.id === activeTraveler));
            button.addEventListener("click", () => {
                activeTraveler = person.id;
                renderTravelerButtons();
                renderItems();
            });
            travelers.appendChild(button);
        });
    };

    renderTravelerButtons();
    renderItems();
})();
