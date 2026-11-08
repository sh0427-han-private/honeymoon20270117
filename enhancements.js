(() => {
    const escapeHtmlSafe = (value) => String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

    const googleMapsSearchUrl = (query) =>
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

    const enhanceHomeSchedule = () => {
        const focusCard = document.querySelector("#home-focus .focus-card");
        const focusList = focusCard?.querySelector(".focus-list");
        const dateLabel = focusCard?.querySelector(".focus-card__date")?.textContent?.trim();

        if (!focusCard || !focusList || !dateLabel || typeof tripData === "undefined") return;

        const day = tripData.days.find((item) => item.label === dateLabel);
        if (!day || focusList.dataset.fullScheduleDate === day.date) return;

        focusList.innerHTML = day.items.map((item) => `
            <li class="focus-item">
                <time>${escapeHtmlSafe(item.time)}</time>
                <div>
                    <strong>${escapeHtmlSafe(item.title)}</strong>
                    ${item.note ? `<small>${escapeHtmlSafe(item.note)}</small>` : ""}
                </div>
            </li>
        `).join("");

        focusList.dataset.fullScheduleDate = day.date;
        focusList.classList.add("focus-list--scrollable");

        let scrollHint = focusCard.querySelector(".focus-scroll-hint");
        if (!scrollHint) {
            scrollHint = document.createElement("div");
            scrollHint.className = "focus-scroll-hint";
            focusList.insertAdjacentElement("beforebegin", scrollHint);
        }

        scrollHint.innerHTML = `
            <span>DAY SCHEDULE</span>
            <small>${day.items.length}개 일정 · 카드 안에서 스크롤</small>
        `;
    };

    const createMapLink = (label, query, extraClass = "") => {
        const link = document.createElement("a");
        link.className = `booking-action booking-action--map ${extraClass}`.trim();
        link.href = googleMapsSearchUrl(query);
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = label;
        return link;
    };

    const ensureConfirmationDialog = () => {
        let dialog = document.querySelector("#confirmation-dialog");
        if (dialog) return dialog;

        dialog = document.createElement("dialog");
        dialog.id = "confirmation-dialog";
        dialog.className = "confirmation-dialog";
        dialog.innerHTML = `
            <div class="confirmation-dialog__shell">
                <div class="confirmation-dialog__head">
                    <div>
                        <span>BOOKING DOCUMENT</span>
                        <strong id="confirmation-dialog-title">예약확인서</strong>
                    </div>
                    <button type="button" class="confirmation-dialog__close" aria-label="예약확인서 닫기">×</button>
                </div>
                <iframe id="confirmation-dialog-frame" title="예약확인서 미리보기"></iframe>
                <div class="confirmation-dialog__foot">
                    <small>문서가 미리보기되지 않으면 새 창에서 열어주세요.</small>
                    <a id="confirmation-dialog-external" target="_blank" rel="noopener noreferrer">새 창에서 열기 ↗</a>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);

        const close = () => {
            dialog.close();
            const frame = dialog.querySelector("#confirmation-dialog-frame");
            if (frame) frame.src = "about:blank";
        };

        dialog.querySelector(".confirmation-dialog__close")?.addEventListener("click", close);
        dialog.addEventListener("click", (event) => {
            if (event.target === dialog) close();
        });

        return dialog;
    };

    const openConfirmation = (title, url) => {
        if (!url) return;
        const dialog = ensureConfirmationDialog();
        dialog.querySelector("#confirmation-dialog-title").textContent = title;
        dialog.querySelector("#confirmation-dialog-frame").src = url;
        dialog.querySelector("#confirmation-dialog-external").href = url;
        dialog.showModal();
    };

    const createConfirmationButton = (title, url) => {
        if (!url) return null;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "booking-action booking-action--document";
        button.textContent = "예약확인서 ↗";
        button.addEventListener("click", () => openConfirmation(title, url));
        return button;
    };

    const addStatusBadge = (card, status) => {
        if (!status || card.querySelector(".booking-status")) return;
        const content = card.querySelector(".booking-content");
        if (!content) return;
        const badge = document.createElement("span");
        badge.className = `booking-status ${status.includes("예약 완료") ? "is-confirmed" : "is-pending"}`;
        badge.textContent = status;
        content.appendChild(badge);
    };

    const addBookingActions = (card, actions) => {
        let actionRow = card.querySelector(".booking-actions");
        if (!actionRow) {
            actionRow = document.createElement("div");
            actionRow.className = "booking-actions";
            card.appendChild(actionRow);
        }
        actions.filter(Boolean).forEach((action) => actionRow.appendChild(action));
    };

    const enhanceFlightCards = () => {
        if (typeof bookingData === "undefined") return;
        const cards = [...document.querySelectorAll("#flight-list .booking-card")];
        cards.forEach((card, index) => {
            if (card.dataset.bookingEnhanced === "true") return;
            const meta = bookingData.flights[index];
            if (!meta) return;

            card.querySelector(".booking-price")?.remove();
            addStatusBadge(card, meta.status);

            const actions = (meta.mapLinks || []).map((item) => createMapLink(item.label, item.query));
            actions.push(createConfirmationButton(card.querySelector(".booking-content strong")?.textContent || "항공 예약", meta.confirmationUrl));
            addBookingActions(card, actions);
            card.dataset.bookingEnhanced = "true";
        });
    };

    const enhanceHotelCards = () => {
        if (typeof bookingData === "undefined") return;
        const cards = [...document.querySelectorAll("#hotel-list .booking-card")];
        cards.forEach((card, index) => {
            if (card.dataset.bookingEnhanced === "true") return;
            const meta = bookingData.hotels[index];
            if (!meta) return;

            card.querySelector(".booking-price")?.remove();
            card.querySelector(".booking-map-link")?.remove();
            addStatusBadge(card, meta.status);

            const mapLink = createMapLink(meta.mapLabel || "위치 열기 ↗", meta.mapQuery, meta.approximate ? "approximate" : "");
            if (meta.approximate) {
                mapLink.title = "정확한 Airbnb 주소는 Public 레포에 저장하지 않아 Fairlie 지역 지도를 엽니다.";
            }
            addBookingActions(card, [
                mapLink,
                createConfirmationButton(card.querySelector(".booking-content strong")?.textContent || "숙소 예약", meta.confirmationUrl)
            ]);
            card.dataset.bookingEnhanced = "true";
        });
    };

    const renderTourBookings = () => {
        if (typeof bookingData === "undefined") return;
        const hotelList = document.querySelector("#hotel-list");
        if (!hotelList) return;

        let tourList = document.querySelector("#tour-list");
        if (!tourList) {
            tourList = document.createElement("div");
            tourList.id = "tour-list";
            tourList.className = "booking-stack booking-tour-stack";
            hotelList.insertAdjacentElement("afterend", tourList);
        }

        if (tourList.dataset.rendered === "true") return;

        tourList.innerHTML = `
            <h3 class="subsection-title">Tours</h3>
            ${bookingData.tours.map((tour) => `
                <article class="booking-card booking-tour-card" data-tour-key="${escapeHtmlSafe(tour.key)}">
                    <div class="booking-date">${escapeHtmlSafe(tour.date)}</div>
                    <div class="booking-content">
                        <strong>${escapeHtmlSafe(tour.name)}</strong>
                        <span>${escapeHtmlSafe(tour.time)} · ${escapeHtmlSafe(tour.city)}</span>
                        <span class="booking-status ${tour.status.includes("예약 완료") ? "is-confirmed" : "is-pending"}">${escapeHtmlSafe(tour.status)}</span>
                    </div>
                    <div class="booking-actions"></div>
                </article>
            `).join("")}
        `;

        [...tourList.querySelectorAll(".booking-tour-card")].forEach((card, index) => {
            const tour = bookingData.tours[index];
            if (!tour) return;
            addBookingActions(card, [
                createMapLink("위치 열기 ↗", tour.mapQuery),
                createConfirmationButton(tour.name, tour.confirmationUrl)
            ]);
        });

        tourList.dataset.rendered = "true";
    };

    const updateBookingSummary = () => {
        if (typeof bookingData === "undefined") return;
        const summary = document.querySelector("#booking-summary");
        if (!summary || summary.dataset.bookingSummaryEnhanced === "true") return;
        summary.innerHTML = `
            <article class="booking-stat"><span>FLIGHTS</span><strong>${bookingData.flights.length}</strong></article>
            <article class="booking-stat"><span>STAYS</span><strong>${bookingData.hotels.length}</strong></article>
            <article class="booking-stat"><span>TOURS</span><strong>${bookingData.tours.length}</strong></article>
        `;
        summary.dataset.bookingSummaryEnhanced = "true";
    };

    const addBookingPrivacyNote = () => {
        const summary = document.querySelector("#booking-summary");
        if (!summary || document.querySelector("#booking-privacy-note")) return;
        const note = document.createElement("div");
        note.id = "booking-privacy-note";
        note.className = "booking-privacy-note";
        note.innerHTML = `
            <strong>Booking Wallet</strong>
            <span>가격 대신 위치와 예약 정보를 빠르게 확인합니다.</span>
        `;
        summary.insertAdjacentElement("afterend", note);
    };

    const addJourneyMapLinks = () => {
        if (typeof bookingData === "undefined") return;
        const stops = [...document.querySelectorAll("#journey-strip .journey-stop")];
        stops.forEach((stop, index) => {
            if (stop.querySelector(".journey-map-link")) return;
            const target = bookingData.hotels.filter((hotel) => hotel.key !== "incheon-ibis-t2")[index];
            if (!target) return;

            const link = document.createElement("a");
            link.className = `journey-map-link${target.approximate ? " approximate" : ""}`;
            link.href = googleMapsSearchUrl(target.mapQuery);
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = target.approximate ? "Fairlie 지도 ↗" : "숙소 지도 ↗";
            link.addEventListener("click", (event) => event.stopPropagation());
            stop.appendChild(link);
        });
    };

    const applyEnhancements = () => {
        enhanceHomeSchedule();
        updateBookingSummary();
        addBookingPrivacyNote();
        enhanceFlightCards();
        enhanceHotelCards();
        renderTourBookings();
        addJourneyMapLinks();
    };

    applyEnhancements();

    let scheduled = false;
    const observer = new MutationObserver(() => {
        if (scheduled) return;
        scheduled = true;
        window.requestAnimationFrame(() => {
            scheduled = false;
            applyEnhancements();
        });
    });

    [
        document.querySelector("#home-focus"),
        document.querySelector("#flight-list"),
        document.querySelector("#hotel-list"),
        document.querySelector("#journey-strip")
    ]
        .filter(Boolean)
        .forEach((node) => observer.observe(node, { childList: true, subtree: true }));
})();
