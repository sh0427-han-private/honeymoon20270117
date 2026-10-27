(() => {
    "use strict";
    if (typeof tripData === "undefined" || !Array.isArray(tripData.days)) return;

    const host = document.getElementById("schedule-overview");
    const daily = document.getElementById("schedule-day-view");
    const switcher = document.getElementById("schedule-view-switch");
    const jumpToday = document.getElementById("jump-today");
    if (!host || !daily || !switcher) return;

    const statusNames = { fixed: "고정", planned: "계획", candidate: "후보" };
    const regions = [
        { id: "all", title: "전체" },
        { id: "sydney", title: "시드니" },
        { id: "south", title: "뉴질랜드 남섬" },
        { id: "auckland", title: "오클랜드" }
    ];
    const state = { view: "day", region: "all", status: "all" };
    const isClock = (time) => /^([01]\d|2[0-3]):[0-5]\d$/.test(time || "");
    const regionOf = (day) => {
        if (day.city === "Sydney") return "sydney";
        if (day.city === "Auckland") return "auckland";
        return "south";
    };
    const el = (tag, className, textValue) => {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (textValue !== undefined) node.textContent = textValue;
        return node;
    };

    const setView = (view) => {
        if (view !== "day" && view !== "all") return;
        state.view = view;
        daily.hidden = view !== "day";
        host.hidden = view !== "all";
        if (jumpToday) jumpToday.hidden = view !== "day";

        switcher.querySelectorAll("[data-schedule-view]").forEach((button) => {
            const active = button.dataset.scheduleView === view;
            button.classList.toggle("active", active);
            button.setAttribute("aria-selected", String(active));
            button.tabIndex = active ? 0 : -1;
        });

        if (view === "day") {
            // The daily timeline and booking links are the existing canonical renderer.
            if (typeof renderSelectedDay === "function") renderSelectedDay();
        } else {
            renderOverview();
        }
    };

    const makeFilter = (group, id, label, active) => {
        const button = el("button", "schedule-overview-filter" + (active ? " active" : ""), label);
        button.type = "button";
        button.dataset[group === "region" ? "overviewRegion" : "overviewStatus"] = id;
        button.setAttribute("aria-pressed", String(active));
        return button;
    };

    const addFilters = (parent, label, group, choices, selected) => {
        const section = el("div", "schedule-overview-filter-group");
        section.appendChild(el("span", "schedule-overview-filter-label", label));
        const options = el("div", "schedule-overview-filter-options");
        options.setAttribute("role", "group");
        options.setAttribute("aria-label", label);
        choices.forEach((entry) => {
            options.appendChild(makeFilter(group, entry.id, entry.title, selected === entry.id));
        });
        section.appendChild(options);
        parent.appendChild(section);
    };

    const appendEvent = (cell, record, date) => {
        const { item } = record;
        const status = statusNames[item.planStatus] ? item.planStatus : "candidate";
        const button = el("button", "schedule-overview-event schedule-overview-event--" + status);
        button.type = "button";
        button.dataset.overviewDate = date;
        button.title = item.time + " · " + statusNames[status] + " · " + item.title +
            (item.note ? "\n" + item.note : "") + "\n눌러서 하루 일정 보기";
        const head = el("span", "schedule-overview-event-head");
        head.appendChild(el("span", "schedule-overview-event-time", item.time));
        head.appendChild(el("span", "schedule-overview-status schedule-overview-status--" + status, statusNames[status]));
        button.appendChild(head);
        button.appendChild(el("strong", "schedule-overview-event-title", item.title));
        cell.appendChild(button);
    };

    const renderOverview = () => {
        host.replaceChildren();
        const days = tripData.days.filter((day) => state.region === "all" || regionOf(day) === state.region);
        const total = days.reduce((sum, day) => sum + day.items.filter((item) =>
            state.status === "all" || item.planStatus === state.status
        ).length, 0);

        const summary = el("div", "schedule-overview-heading");
        const heading = el("div", "");
        heading.appendChild(el("h3", "", "전체 여행 시간표"));
        heading.appendChild(el("p", "", "2027.01.17—01.29 · 날짜별·시간별 한눈에 보기"));
        summary.appendChild(heading);
        summary.appendChild(el("span", "schedule-overview-count", days.length + "일 · " + total + "개 일정"));
        host.appendChild(summary);

        const controls = el("div", "schedule-overview-controls");
        addFilters(controls, "구간", "region", regions, state.region);
        addFilters(controls, "상태", "status", [
            { id: "all", title: "전체" },
            { id: "fixed", title: "고정" },
            { id: "planned", title: "계획" },
            { id: "candidate", title: "후보" }
        ], state.status);
        host.appendChild(controls);

        const guide = el("p", "schedule-overview-guide", "표를 좌우로 밀어 다른 날짜를 확인하세요. 일정을 누르면 해당 날짜의 상세 화면으로 이동합니다.");
        host.appendChild(guide);

        const byDate = new Map();
        const hours = [];
        days.forEach((day) => {
            const buckets = new Map();
            day.items.forEach((item, index) => {
                if (state.status !== "all" && item.planStatus !== state.status) return;
                const clock = isClock(item.time);
                const slot = clock ? Number(item.time.slice(0, 2)) : "other";
                if (!buckets.has(slot)) buckets.set(slot, []);
                buckets.get(slot).push({ item, index });
                if (clock) hours.push(slot);
            });
            byDate.set(day.date, buckets);
        });
        const start = hours.length ? Math.min(...hours) : 8;
        const end = hours.length ? Math.max(...hours) : 22;
        const slots = Array.from({ length: end - start + 1 }, (_, offset) => start + offset);
        if (days.some((day) => byDate.get(day.date)?.has("other"))) slots.push("other");

        const viewport = el("div", "schedule-overview-scroll");
        viewport.tabIndex = 0;
        viewport.setAttribute("role", "region");
        viewport.setAttribute("aria-label", "전체 날짜 시간표, 세로 및 가로로 스크롤 가능");
        const table = el("table", "schedule-overview-table");
        table.setAttribute("aria-label", "신혼여행 2027 날짜와 시간별 전체 일정");
        const thead = el("thead");
        const header = el("tr");
        const timeHead = el("th", "schedule-overview-hour schedule-overview-corner", "시간");
        timeHead.scope = "col";
        header.appendChild(timeHead);
        days.forEach((day) => {
            const cell = el("th", "schedule-overview-date");
            cell.scope = "col";
            cell.appendChild(el("strong", "", day.label));
            cell.appendChild(el("small", "", day.city));
            header.appendChild(cell);
        });
        thead.appendChild(header);
        table.appendChild(thead);

        const tbody = el("tbody");
        slots.forEach((slot) => {
            const row = el("tr", slot === "other" ? "schedule-overview-untimed" : "");
            const hour = el("th", "schedule-overview-hour",
                slot === "other" ? "기타" : String(slot).padStart(2, "0") + ":00");
            hour.scope = "row";
            row.appendChild(hour);

            days.forEach((day) => {
                const cell = el("td", "schedule-overview-cell");
                const records = byDate.get(day.date).get(slot) || [];
                records.forEach((record) => appendEvent(cell, record, day.date));
                if (!records.length) cell.classList.add("schedule-overview-cell--empty");
                row.appendChild(cell);
            });
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        viewport.appendChild(table);
        host.appendChild(viewport);
        host.appendChild(el("p", "schedule-overview-footnote",
            "고정 = 예약·운영 시각 · 계획 = 시간 조정 가능 · 후보 = 검토 중. 표의 모든 시간은 각 여행지 현지 시각이며, '기타'는 기내·투어 중처럼 시각이 정해지지 않은 일정입니다."));
    };

    switcher.addEventListener("click", (event) => {
        const button = event.target.closest("[data-schedule-view]");
        if (button && switcher.contains(button)) setView(button.dataset.scheduleView);
    });
    switcher.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        const next = event.key === "ArrowRight" ? "all" : "day";
        setView(next);
        switcher.querySelector('[data-schedule-view="' + next + '"]')?.focus();
        event.preventDefault();
    });

    host.addEventListener("click", (event) => {
        const regionButton = event.target.closest("[data-overview-region]");
        if (regionButton && host.contains(regionButton)) {
            state.region = regionButton.dataset.overviewRegion;
            renderOverview();
            return;
        }
        const statusButton = event.target.closest("[data-overview-status]");
        if (statusButton && host.contains(statusButton)) {
            state.status = statusButton.dataset.overviewStatus;
            renderOverview();
            return;
        }
        const eventButton = event.target.closest("[data-overview-date]");
        if (!eventButton || !host.contains(eventButton)) return;
        const date = eventButton.dataset.overviewDate;
        if (!tripData.days.some((day) => day.date === date)) return;
        selectedDate = date;
        selectedSchedulePlaceName = null;
        if (typeof renderDateStrips === "function") renderDateStrips();
        if (typeof renderRoute === "function") renderRoute();
        setView("day");
        switcher.querySelector('[data-schedule-view="day"]')?.focus({ preventScroll: true });
        document.querySelector("#schedule-panel .section-heading")?.scrollIntoView({
            behavior: "smooth", block: "start"
        });
    });

    // The home-screen "Today's schedule" action should always open the daily view.
    document.addEventListener("click", (event) => {
        if (event.target.closest("#travel-now-open-schedule")) setView("day");
    }, true);

    renderOverview();
    setView("day");
})();