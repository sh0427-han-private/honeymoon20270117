(() => {
    if (typeof tripData === "undefined") return;

    const safe = (value) => (
        typeof escapeHtml === "function" ? escapeHtml(value) : String(value)
    );

    const googleNavigationUrl = (place) => {
        if (!place) return "#";
        const destination = `${place.name}, ${place.city}`;
        const params = new URLSearchParams({ api: "1", destination, dir_action: "navigate" });
        return `https://www.google.com/maps/dir/?${params.toString()}`;
    };

    const enhanceTimelineDirections = () => {
        if (typeof findPlace !== "function") return;
        document.querySelectorAll(".timeline-item[data-schedule-place]").forEach((row) => {
            if (row.querySelector(".timeline-directions")) return;
            const place = findPlace(row.dataset.schedulePlace);
            const content = row.querySelector(".timeline-content");
            if (!place || !content) return;
            const actions = document.createElement("div");
            actions.className = "timeline-directions";
            actions.innerHTML = `<a href="${googleNavigationUrl(place)}" target="_blank" rel="noopener noreferrer">길찾기 시작 ↗</a>`;
            actions.querySelector("a")?.addEventListener("click", (event) => event.stopPropagation());
            content.appendChild(actions);
        });
    };

    const removeBookingUpcoming = () => {
        document.querySelector("#booking-upcoming")?.remove();
    };

    const CHECKLIST = [
        { id: "passport", title: "여권", note: "두 사람 여권 실물 · 유효기간 확인" },
        { id: "icn-ibis", title: "1/16 인천공항 숙소", note: "이비스 스타일 T2 예약 완료 · 새벽 T2 이동 방법 확인 필요" },
        { id: "t2-parking", title: "T2 장기주차 예약", note: "1/16~1/29 셀토스 · 12/2 이후 예약 예정(입차 시각에 따라 달라짐)" },
        { id: "au-eta", title: "호주 ETA", note: "11/8 신청·외화 결제 완료 · 승인 상태 확인 필요" },
        { id: "nzeta", title: "NZeTA + IVL", note: "11/8 신청·외화 결제 완료 · 발급 상태 확인 필요" },
        { id: "ipc", title: "호주 IPC 작성 가이드", note: "1/17 KE401 기내 작성 · 더보기 > 입국에서 확인" },
        { id: "nztd", title: "뉴질랜드 NZTD", note: "1/19 10:55 AEDT부터 두 사람 각각 제출" },
        { id: "license", title: "렌터카 운전 준비", note: "국내 면허 · 국제운전 관련 서류 확인" },
        { id: "insurance", title: "여행자보험", note: "가입 및 긴급 연락 방법 확인" },
        { id: "esim", title: "eSIM / 로밍", note: "두 사람 통신 준비" },
        { id: "offline", title: "오프라인 준비", note: "Honeymoon 앱 · 필요한 Google Maps 지역 저장" },
        { id: "milford", title: "Milford 예약 최종 확인", note: "집결시간 · 장소 확인" },
        { id: "onsen", title: "Onsen 예약 최종 확인", note: "1/23 08:45 도착 기준" },
        { id: "rotorua", title: "Rotorua 예약 최종 확인", note: "집결시간 · 포함 일정 확인" }
    ];

    const checklistKey = (id) => `honeymoon-prep-${id}`;

    // 두 신청의 완료 사실을 기존 기기별 체크 상태에 한 번만 반영한다.
    // 이후 사용자가 직접 체크를 변경하면 해당 기기의 선택을 존중한다.
    const completedApplicationsMigrationKey = "honeymoon-prep-eta-nzeta-paid-20261108-v1";
    const icnStayMigrationKey = "honeymoon-prep-incheon-ibis-20261108-v1";
    try {
        if (localStorage.getItem(completedApplicationsMigrationKey) !== "true") {
            ["au-eta", "nzeta"].forEach((id) => localStorage.setItem(checklistKey(id), "true"));
            localStorage.setItem(completedApplicationsMigrationKey, "true");
        }
    } catch (error) {
        // 저장소를 차단한 브라우저에서는 기존 체크리스트 로직에 맡긴다.
    }
    try {
        if (localStorage.getItem(icnStayMigrationKey) !== "true") {
            localStorage.setItem(checklistKey("icn-ibis"), "true");
            localStorage.setItem(icnStayMigrationKey, "true");
        }
    } catch (error) {
        // 저장소 차단 환경에서는 기존 체크리스트 동작만 유지한다.
    }

    const renderChecklist = (force = false) => {
        const panel = document.querySelector("#more-panel");
        if (!panel) return;
        let section = panel.querySelector("#travel-prep-checklist");
        if (!section) {
            section = document.createElement("section");
            section.id = "travel-prep-checklist";
            section.className = "more-section travel-prep-checklist";
            const pwaCard = panel.querySelector("#pwa-install-card");
            const firstMore = panel.querySelector(".more-section");
            if (pwaCard) pwaCard.insertAdjacentElement("afterend", section);
            else if (firstMore) firstMore.insertAdjacentElement("beforebegin", section);
            else panel.appendChild(section);
        } else if (!force && section.dataset.rendered === "true") {
            return;
        }

        const completed = CHECKLIST.filter((item) => localStorage.getItem(checklistKey(item.id)) === "true").length;
        const shouldOpen = !(typeof tripState !== "undefined" && tripState.mode === "during");
        section.dataset.rendered = "true";
        section.innerHTML = `
            <details ${shouldOpen ? "open" : ""}>
                <summary>
                    <div><p class="section-kicker">BEFORE DEPARTURE</p><strong>여행 준비 체크리스트</strong></div>
                    <span>${completed} / ${CHECKLIST.length}</span>
                </summary>
                <div class="travel-prep-list">
                    ${CHECKLIST.map((item) => {
                        const checked = localStorage.getItem(checklistKey(item.id)) === "true";
                        return `<label class="travel-prep-item"><input type="checkbox" data-prep-id="${safe(item.id)}" ${checked ? "checked" : ""}><span class="travel-prep-check" aria-hidden="true"></span><span><strong>${safe(item.title)}</strong><small>${safe(item.note)}</small></span></label>`;
                    }).join("")}
                </div>
            </details>
        `;

        section.querySelectorAll("[data-prep-id]").forEach((checkbox) => {
            checkbox.addEventListener("change", () => {
                localStorage.setItem(checklistKey(checkbox.dataset.prepId), String(checkbox.checked));
                renderChecklist(true);
            });
        });
    };

    const applyTravelMode = () => {
        const active = typeof tripState !== "undefined" && tripState.mode === "during";
        const value = active ? "active" : "editorial";
        if (document.documentElement.dataset.travelUi !== value) {
            document.documentElement.dataset.travelUi = value;
        }
    };

    const renderPrivateDriveEntry = () => {
        if (typeof bookingData === "undefined" || !bookingData.privateDrive?.folderUrl) return;
        const panel = document.querySelector("#bookings-panel");
        if (!panel) return;

        let section = panel.querySelector("#private-drive-entry");
        if (!section) {
            section = document.createElement("section");
            section.id = "private-drive-entry";
            section.className = "private-drive-entry";
            section.innerHTML = `
                <div>
                    <p class="section-kicker">PRIVATE DRIVE</p>
                    <strong>${safe(bookingData.privateDrive.label || "Private Travel Docs")}</strong>
                    <span>Google 계정 권한이 있는 사용자만 문서를 열 수 있습니다.</span>
                </div>
                <a href="${safe(bookingData.privateDrive.folderUrl)}" target="_blank" rel="noopener noreferrer">Drive 문서 열기 ↗</a>
            `;
        }

        const apps = panel.querySelector("#booking-app-launcher");
        const anchor = apps
            || panel.querySelector("#tour-list")
            || panel.querySelector("#hotel-list")
            || panel.querySelector("#flight-list");
        if (!anchor) return;

        if (anchor.nextElementSibling !== section) {
            anchor.insertAdjacentElement("afterend", section);
        }
    };

    const apply = () => {
        applyTravelMode();
        enhanceTimelineDirections();
        removeBookingUpcoming();
        renderChecklist();
        renderPrivateDriveEntry();
    };

    apply();

    let queued = false;
    const observer = new MutationObserver(() => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
            queued = false;
            apply();
        });
    });

    [
        document.querySelector("#schedule-panel"),
        document.querySelector("#bookings-panel"),
        document.querySelector("#more-panel")
    ]
        .filter(Boolean)
        .forEach((node) => observer.observe(node, { childList: true, subtree: true }));

    if (!window.tripClock?.isTestMode) {
        window.setInterval(applyTravelMode, 60000);
    }
})();
