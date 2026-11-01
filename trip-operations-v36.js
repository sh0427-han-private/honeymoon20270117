(() => {
    if (typeof tripData === "undefined" || typeof bookingData === "undefined") {
        return;
    }

    const selectedDayPanel = document.querySelector("#selected-day");
    if (!selectedDayPanel) return;

    const safe = (value) => (
        typeof escapeHtml === "function" ? escapeHtml(value) : String(value)
    );

    const bookingForKey = (bookingKey) => {
        const flight = bookingData.flights?.find(
            (item) => item.key === bookingKey
        );
        if (flight) return { kind: "flight", data: flight };

        const hotel = bookingData.hotels?.find(
            (item) => item.key === bookingKey
        );
        if (hotel) return { kind: "hotel", data: hotel };

        const tour = bookingData.tours?.find(
            (item) => item.key === bookingKey
        );
        if (tour) return { kind: "tour", data: tour };

        if (bookingData.rental?.key === bookingKey) {
            return { kind: "rental", data: bookingData.rental };
        }
        return null;
    };

    const normalizeDocuments = ({ kind, data }) => {
        if (kind === "flight") {
            const shared = Array.isArray(data.sharedDocuments)
                ? data.sharedDocuments.filter((document) => document?.url)
                : [];
            if (shared.length) return shared;

            return Object.entries(data.tickets || {})
                .filter(([, document]) => document?.url)
                .map(([passenger, document]) => ({
                    ...document,
                    label: passenger === "sanghun"
                        ? "상훈 티켓"
                        : passenger === "jinyeong"
                            ? "진영 티켓"
                            : "항공 티켓"
                }));
        }

        const documents = Array.isArray(data.documents)
            ? data.documents
            : data.document
                ? [data.document]
                : [];
        const connected = documents.filter((document) => document?.url);

        if (kind !== "hotel" || connected.length <= 1) return connected;
        const preferred = connected.find((document) => (
            document.label?.includes("영문")
        ));
        return preferred ? [preferred] : [connected[0]];
    };

    const needsBookingDetails = ({ kind, data }, documents) => (
        (kind === "tour" && documents.length === 0)
        || String(data.status || "").includes("미입력")
    );

    const documentLabel = (document, kind) => {
        if (document.label) return document.label;
        if (kind === "hotel") return "숙소 예약서";
        if (kind === "tour") return "투어 예약서";
        if (kind === "rental") return "렌터카 예약서";
        return "예약 문서";
    };

    const renderDocumentActions = (booking, className) => {
        const documents = normalizeDocuments(booking);
        const links = documents.map((document) => `
            <a
                href="${safe(document.url)}"
                target="_blank"
                rel="noopener noreferrer"
            >${safe(documentLabel(document, booking.kind))} ↗</a>
        `).join("");
        const pending = needsBookingDetails(booking, documents)
            ? '<span class="booking-detail-needed">예약정보 확인 필요</span>'
            : "";
        if (!links && !pending) return "";
        return `<div class="${className}">${links}${pending}</div>`;
    };

    const googleMapsUrl = (query) => {
        const params = new URLSearchParams({ api: "1", destination: query });
        return `https://www.google.com/maps/dir/?${params.toString()}`;
    };

    const renderFlightOperation = () => {
        const operation = tripData.flightOperations?.find(
            (item) => item.date === selectedDate
        );
        if (!operation) return;

        const header = selectedDayPanel.querySelector(".day-detail__header");
        if (!header || header.nextElementSibling?.matches(".flight-operation-card")) {
            return;
        }

        const booking = bookingForKey(operation.bookingKey);
        const documentActions = booking
            ? renderDocumentActions(booking, "flight-operation-documents")
            : "";
        const card = document.createElement("aside");
        card.className = "flight-operation-card";
        card.setAttribute("aria-label", `${operation.route} 공항 이동 안내`);
        card.innerHTML = `
            <div class="flight-operation-head">
                <div>
                    <span class="flight-category ${operation.category === "국내선" ? "is-domestic" : ""}">${safe(operation.category)}</span>
                    <strong>${safe(operation.route)}</strong>
                </div>
                <small>${safe(operation.countries)}</small>
            </div>
            <div class="flight-operation-grid">
                <div class="flight-operation-step is-transfer">
                    <span>공항 이동</span>
                    <strong>${safe(operation.airportTransfer)}</strong>
                    <small>${safe(operation.airportTarget)}</small>
                </div>
                <div class="flight-operation-step">
                    <span>출발</span>
                    <strong>${safe(operation.departure)}</strong>
                    <small>${safe(operation.departurePlace)}</small>
                </div>
                <div class="flight-operation-step">
                    <span>도착</span>
                    <strong>${safe(operation.arrival)}</strong>
                    <small>${safe(operation.arrivalPlace)}</small>
                </div>
            </div>
            <p class="flight-operation-notice">
                터미널·체크인 카운터·탑승구는 출발 당일 티켓과 항공사 앱에서 최종 확인
            </p>
            <div class="flight-operation-actions">
                <a
                    href="${safe(googleMapsUrl(operation.mapQuery))}"
                    target="_blank"
                    rel="noopener noreferrer"
                >출발 공항 길찾기 ↗</a>
                ${documentActions}
            </div>
        `;
        header.insertAdjacentElement("afterend", card);
    };

    const enhanceTimelineDocuments = () => {
        const day = tripData.days.find((item) => item.date === selectedDate);
        if (!day) return;

        selectedDayPanel.querySelectorAll(".timeline-item").forEach((row) => {
            if (row.querySelector(".timeline-booking-actions")) return;
            const index = Number(row.dataset.itemIndex);
            if (!Number.isInteger(index) || index < 0) return;
            const item = day.items[index];
            if (!item?.bookingKey) return;

            const booking = bookingForKey(item.bookingKey);
            const content = row.querySelector(".timeline-content");
            if (!booking || !content) return;

            const html = renderDocumentActions(
                booking,
                "timeline-booking-actions"
            );
            if (!html) return;
            content.insertAdjacentHTML("beforeend", html);
            content.querySelectorAll(".timeline-booking-actions a").forEach(
                (link) => link.addEventListener("click", (event) => {
                    event.stopPropagation();
                })
            );
        });
    };

    const apply = () => {
        renderFlightOperation();
        enhanceTimelineDocuments();
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
    observer.observe(selectedDayPanel, { childList: true, subtree: true });
})();
