(() => {
    if (typeof bookingData === "undefined") return;

    const safe = (value) => (
        typeof escapeHtml === "function" ? escapeHtml(value) : String(value)
    );

    const googleMapsSearchUrl = (query) =>
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

    const isAmount = (value) => typeof value === "number" && Number.isFinite(value);

    const formatMoney = (currency, amount) => `${currency} ${new Intl.NumberFormat("en-US", {
        minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
        maximumFractionDigits: 2
    }).format(amount)}`;

    const isLocalPayment = (payment) => (
        ["pay_on_site", "partial"].includes(payment?.status)
        && isAmount(payment?.amountDue)
    );

    const paymentBadge = (payment, showPaid = false) => {
        if (showPaid && payment?.status === "paid" && isAmount(payment?.paidAmount)) {
            const badge = document.createElement("div");
            badge.className = "booking-payment booking-payment-paid";
            badge.textContent = `결제 완료 · ${formatMoney(payment.currency, payment.paidAmount)}`;
            return badge;
        }
        if (!isLocalPayment(payment)) return null;
        const badge = document.createElement("div");
        badge.className = "booking-payment booking-payment-local";
        badge.textContent = `현지결제 필요 · ${formatMoney(payment.currency, payment.amountDue)}`;
        return badge;
    };

    const syncCompactPayment = (card, payment, showPaid = false) => {
        if (!card) return;
        card.querySelectorAll(".booking-payment").forEach((node) => node.remove());
        const badge = paymentBadge(payment, showPaid);
        if (!badge) return;
        const actions = card.querySelector(".booking-actions");
        if (actions) actions.insertAdjacentElement("beforebegin", badge);
        else card.appendChild(badge);
    };

    const syncAllPaymentBadges = () => {
        [...document.querySelectorAll("#hotel-list .booking-card")].forEach((card, index) => {
            syncCompactPayment(card, bookingData.hotels?.[index]?.payment);
        });
        [...document.querySelectorAll("#tour-list .booking-tour-card")].forEach((card, index) => {
            const tour = bookingData.tours?.[index];
            syncCompactPayment(card, tour?.payment, tour?.key === "onsen");
        });
        syncCompactPayment(
            document.querySelector("#rental-list .booking-rental-card"),
            bookingData.rental?.payment
        );
    };

    const renderCompactLocalPaymentSummary = () => {
        const statement = document.querySelector("#payment-statement");
        if (!statement) return;

        const entries = [];
        bookingData.hotels?.forEach((hotel, index) => {
            if (!isLocalPayment(hotel.payment)) return;
            const itineraryHotel = typeof tripData !== "undefined" ? tripData.hotels?.[index] : null;
            entries.push({
                name: itineraryHotel?.name || hotel.key,
                date: itineraryHotel?.dates || "숙박",
                payment: hotel.payment
            });
        });
        if (isLocalPayment(bookingData.rental?.payment)) {
            entries.push({
                name: "Hertz 렌터카",
                date: bookingData.rental.date,
                payment: bookingData.rental.payment
            });
        }
        bookingData.tours?.forEach((tour) => {
            if (!isLocalPayment(tour.payment)) return;
            entries.push({ name: tour.name, date: tour.date, payment: tour.payment });
        });

        if (entries.length === 0) {
            statement.hidden = true;
            return;
        }
        statement.hidden = false;

        const totals = entries.reduce((acc, entry) => {
            const currency = entry.payment.currency;
            acc[currency] = (acc[currency] || 0) + entry.payment.amountDue;
            return acc;
        }, {});

        statement.innerHTML = `
            <div class="payment-statement-head compact">
                <div>
                    <span class="payment-eyebrow">LOCAL PAYMENT</span>
                    <h3>현지 결제 필요</h3>
                </div>
                <div class="payment-total-chips">
                    ${Object.entries(totals).map(([currency, total]) => `
                        <strong>${safe(formatMoney(currency, total))}</strong>
                    `).join("")}
                </div>
            </div>
        `;
    };

    const enhanceMilfordCard = () => {
        const milford = bookingData.tours?.find((tour) => tour.key === "milford");
        const card = document.querySelector('#tour-list .booking-tour-card[data-tour-key="milford"]');
        if (!milford || !card) return;

        const content = card.querySelector(".booking-content");
        if (content) {
            [...content.querySelectorAll("span:not(.booking-status)")].forEach((node) => node.remove());
            const pickup = document.createElement("span");
            pickup.textContent = `픽업 ${milford.pickup || "06:45 · Hampshire Holiday Parks Queenstown Lakeview"}`;
            const departure = document.createElement("span");
            departure.textContent = `코치 출발 ${milford.coachDeparture || "07:00 · Southern Discoveries Queenstown Visitor Centre"}`;
            const returning = document.createElement("span");
            returning.textContent = `복귀 ${milford.returnTime || "19:30 예정"} · ${milford.returnLocation || "Southern Discoveries Queenstown Visitor Centre"}`;
            content.append(pickup, departure, returning);
        }

        const actions = card.querySelector(".booking-actions");
        if (!actions || actions.dataset.milfordV32 === "true") return;

        actions.querySelectorAll(".booking-action--map").forEach((link) => link.remove());

        const makeMapLink = (label, query) => {
            const link = document.createElement("a");
            link.className = "booking-action booking-action--map";
            link.href = googleMapsSearchUrl(query);
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = `${label} ↗`;
            return link;
        };

        const first = actions.firstChild;
        [
            makeMapLink("픽업 위치", milford.pickupMapQuery || "Hampshire Holiday Parks Queenstown Lakeview, Queenstown, New Zealand"),
            makeMapLink("복귀 위치", milford.returnMapQuery || "Southern Discoveries Queenstown Visitor Centre, 110 Beach Street, Queenstown, New Zealand"),
            makeMapLink("Milford 위치", milford.mapQuery)
        ].forEach((link) => actions.insertBefore(link, first));

        actions.dataset.milfordV32 = "true";
    };

    const activeListSelector = () => {
        const active = document.querySelector("[data-booking-filter].active")?.dataset.bookingFilter || "flights";
        return {
            flights: "#flight-list",
            stays: "#hotel-list",
            tours: "#tour-list",
            car: "#rental-list"
        }[active] || "#flight-list";
    };

    const positionActiveList = () => {
        const panel = document.querySelector("#bookings-panel");
        const statement = document.querySelector("#payment-statement");
        const summary = document.querySelector("#booking-summary");
        const activeList = document.querySelector(activeListSelector());
        if (!panel || !activeList) return;
        const anchor = statement && !statement.hidden ? statement : summary;
        if (anchor) anchor.insertAdjacentElement("afterend", activeList);
    };

    const apply = () => {
        renderCompactLocalPaymentSummary();
        syncAllPaymentBadges();
        enhanceMilfordCard();
        positionActiveList();
    };

    document.querySelectorAll("[data-booking-filter]").forEach((button) => {
        button.addEventListener("click", () => window.requestAnimationFrame(apply));
    });

    apply();
    window.setTimeout(apply, 100);
})();