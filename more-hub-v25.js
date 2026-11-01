(() => {
    const panel = document.querySelector("#more-panel");
    if (!panel || typeof bookingData === "undefined") return;

    const safe = (value) => (
        typeof escapeHtml === "function" ? escapeHtml(value) : String(value)
    );

    const FILTERS = [
        { id: "prep", label: "준비" },
        { id: "packing", label: "준비물" },
        { id: "entry", label: "입국" },
        { id: "docs", label: "문서" },
        { id: "emergency", label: "긴급" },
        { id: "gifts", label: "선물" }
    ];

    let activeFilter = "prep";

    const removeLegacyBudget = () => {
        panel.querySelector("#budget-summary")?.closest(".more-section")?.remove();
    };

    const getItemDocuments = (item) => {
        if (Array.isArray(item?.documents)) {
            return item.documents.filter(Boolean);
        }
        if (item?.documents && typeof item.documents === "object") {
            return Object.values(item.documents).filter(Boolean);
        }
        return item?.document ? [item.document] : [];
    };

    const getFlightDocuments = (flight) => {
        const shared = Array.isArray(flight?.sharedDocuments)
            ? flight.sharedDocuments.filter(Boolean)
            : [];

        if (shared.length) return shared;

        return [
            ...Object.values(flight?.tickets || {}),
            ...Object.values(flight?.receipts || {})
        ].filter(Boolean);
    };

    const getDocumentGroups = () => {
        const flightDocs = bookingData.flights.flatMap(getFlightDocuments);
        const stayDocs = bookingData.hotels.flatMap(getItemDocuments);
        const tourDocs = bookingData.tours.flatMap(getItemDocuments);
        const rentalDocs = getItemDocuments(bookingData.rental);

        return [
            { label: "항공권", docs: flightDocs },
            { label: "숙박", docs: stayDocs },
            { label: "투어", docs: tourDocs },
            { label: "렌터카", docs: rentalDocs }
        ].map((group) => ({
            label: group.label,
            total: group.docs.length,
            connected: group.docs.filter((doc) => Boolean(doc?.url)).length
        }));
    };

    const renderDocumentStatus = () => {
        let section = panel.querySelector("#booking-doc-status");
        if (!section) {
            section = document.createElement("section");
            section.id = "booking-doc-status";
            section.className = "more-section more-tool-section booking-doc-status";
            section.dataset.moreSection = "docs";
            panel.appendChild(section);
        }

        const groups = getDocumentGroups();
        const total = groups.reduce((sum, group) => sum + group.total, 0);
        const connected = groups.reduce((sum, group) => sum + group.connected, 0);
        const driveUrl = bookingData.privateDrive?.folderUrl;
        const budgetUrl = bookingData.privateDrive?.budgetSheetUrl;

        section.innerHTML = `
            <div class="subsection-heading">
                <h3>예약 문서 연결 현황</h3>
                <span>${connected} / ${total}</span>
            </div>
            <div class="document-status-summary">
                <strong>${connected === total ? "모든 문서 연결 완료" : `${total - connected}개 문서 연결 필요`}</strong>
                <span>Google Drive 파일 URL이 웹앱에 연결된 기준입니다.</span>
            </div>
            <div class="document-status-list">
                ${groups.map((group) => {
                    const percent = group.total ? Math.round(group.connected / group.total * 100) : 0;
                    return `
                        <div class="document-status-row">
                            <div class="document-status-row__top">
                                <strong>${safe(group.label)}</strong>
                                <span>${group.connected} / ${group.total}</span>
                            </div>
                            <div class="document-status-track" aria-hidden="true"><span style="width:${percent}%"></span></div>
                        </div>
                    `;
                }).join("")}
            </div>
            <div class="more-tool-links">
                ${budgetUrl ? `<a class="more-tool-link" href="${safe(budgetUrl)}" target="_blank" rel="noopener noreferrer">여행 예산 Sheet 열기 ↗</a>` : ""}
                ${driveUrl ? `<a class="more-tool-link secondary" href="${safe(driveUrl)}" target="_blank" rel="noopener noreferrer">Private Drive 열기 ↗</a>` : ""}
            </div>
        `;
    };

    const renderEmergency = () => {
        let section = panel.querySelector("#emergency-contacts");
        if (!section) {
            section = document.createElement("section");
            section.id = "emergency-contacts";
            section.className = "more-section more-tool-section emergency-contacts";
            section.dataset.moreSection = "emergency";
            panel.appendChild(section);
        }

        const contacts = [
            { country: "AUSTRALIA", number: "000", tel: "000", title: "호주 긴급 신고", note: "경찰 · 소방 · 구급" },
            { country: "NEW ZEALAND", number: "111", tel: "111", title: "뉴질랜드 긴급 신고", note: "경찰 · 소방 · 구급" },
            { country: "KOREA CONSULAR", number: "+82-2-3210-0404", tel: "+82232100404", title: "영사안전콜센터", note: "해외 사건·사고 · 24시간" }
        ];

        section.innerHTML = `
            <div class="subsection-heading">
                <h3>긴급 연락처</h3>
                <span>현지 긴급상황용</span>
            </div>
            <div class="emergency-list">
                ${contacts.map((contact) => `
                    <a class="emergency-card" href="tel:${safe(contact.tel)}">
                        <span>${safe(contact.country)}</span>
                        <strong>${safe(contact.number)}</strong>
                        <small>${safe(contact.title)} · ${safe(contact.note)}</small>
                    </a>
                `).join("")}
            </div>
            <p class="more-tool-note">생명·신체에 즉각적인 위험이 있으면 현지 긴급번호를 먼저 사용하고, 여권 분실·사건사고·통역 등 영사 지원은 영사안전콜센터를 이용합니다.</p>
        `;
    };

    const tagExistingSections = () => {
        const pwa = panel.querySelector("#pwa-install-card");
        const prep = panel.querySelector("#travel-prep-checklist");
        const gifts = panel.querySelector("#shopping-list")?.closest(".more-section");

        if (pwa) pwa.dataset.moreSection = "prep";
        if (prep) prep.dataset.moreSection = "prep";
        if (gifts) gifts.dataset.moreSection = "gifts";
    };

    const renderFilter = () => {
        const heading = panel.querySelector(".section-heading");
        if (!heading) return;

        heading.querySelector("h2")?.replaceChildren(document.createTextNode("여행 도구"));

        let filter = panel.querySelector("#more-filter-bar");
        if (!filter) {
            filter = document.createElement("div");
            filter.id = "more-filter-bar";
            filter.className = "more-filter-bar";
            heading.insertAdjacentElement("afterend", filter);
        }

        filter.innerHTML = FILTERS.map((item) => `
            <button type="button" data-more-filter="${item.id}" aria-pressed="false">${item.label}</button>
        `).join("");

        filter.querySelectorAll("[data-more-filter]").forEach((button) => {
            button.addEventListener("click", () => {
                activeFilter = button.dataset.moreFilter || "prep";
                applyFilter();
            });
        });
    };

    const applyFilter = () => {
        panel.dataset.moreFilter = activeFilter;
        panel.querySelectorAll("[data-more-filter]").forEach((button) => {
            const selected = button.dataset.moreFilter === activeFilter;
            button.classList.toggle("active", selected);
            button.setAttribute("aria-pressed", String(selected));
        });
    };

    removeLegacyBudget();
    renderDocumentStatus();
    renderEmergency();
    tagExistingSections();
    renderFilter();
    applyFilter();

    const observer = new MutationObserver(() => {
        removeLegacyBudget();
        tagExistingSections();
    });
    observer.observe(panel, { childList: true, subtree: false });
})();
