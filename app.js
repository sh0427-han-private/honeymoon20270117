const TRIP_START = "2027-01-17";
const TRIP_END = "2027-01-29";

const formatKrw = (value) => `${new Intl.NumberFormat("ko-KR").format(value)}원`;

const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const getTypeLabel = (type) => {
    const labels = {
        flight: "항공",
        hotel: "숙소",
        meal: "식사",
        sightseeing: "관광",
        transport: "이동",
        tour: "투어",
        car: "렌터카",
        drive: "드라이브",
        shopping: "쇼핑",
        lounge: "라운지",
        note: "메모"
    };
    return labels[type] || "일정";
};

const toLocalIso = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const isoToUtcMs = (iso) => {
    const [year, month, day] = iso.split("-").map(Number);
    return Date.UTC(year, month - 1, day);
};

const diffDays = (fromIso, toIso) => Math.round(
    (isoToUtcMs(toIso) - isoToUtcMs(fromIso)) / 86400000
);

const getTripState = () => {
    const todayIso = toLocalIso(new Date());

    if (todayIso < TRIP_START) {
        return {
            mode: "before",
            focusDate: TRIP_START,
            label: "NEXT TRIP",
            countdown: diffDays(todayIso, TRIP_START)
        };
    }

    if (todayIso <= TRIP_END) {
        const hasToday = tripData.days.some((day) => day.date === todayIso);
        return {
            mode: "during",
            focusDate: hasToday ? todayIso : TRIP_START,
            label: "TODAY",
            countdown: 0
        };
    }

    return {
        mode: "after",
        focusDate: TRIP_END,
        label: "TRIP COMPLETE",
        countdown: 0
    };
};

const tripState = getTripState();
let selectedDate = tripState.focusDate;
let selectedSchedulePlaceName = null;
let scheduleMap = null;
let scheduleMarkers = new Map();

const countdownValue = document.querySelector("#countdown-value");
const countdownCaption = document.querySelector("#countdown-caption");
const homeFocus = document.querySelector("#home-focus");
const journeyStrip = document.querySelector("#journey-strip");
const dateStrip = document.querySelector("#date-strip");
const routeDateStrip = document.querySelector("#route-date-strip");
const selectedDay = document.querySelector("#selected-day");
const routeSummary = document.querySelector("#route-summary");
const routeList = document.querySelector("#route-list");
const flightList = document.querySelector("#flight-list");
const hotelList = document.querySelector("#hotel-list");
const bookingSummary = document.querySelector("#booking-summary");
const budgetSummary = document.querySelector("#budget-summary");
const budgetList = document.querySelector("#budget-list");
const shoppingList = document.querySelector("#shopping-list");

const supplementalPlaces = [
    { name: "Sydney Airport", city: "Sydney", category: "공항", lat: -33.9399, lng: 151.1753 },
    { name: "Sydney Observatory", city: "Sydney", category: "관광", lat: -33.8599, lng: 151.2049 },
    { name: "The Rocks", city: "Sydney", category: "관광", lat: -33.8599, lng: 151.2090 },
    { name: "Barangaroo", city: "Sydney", category: "관광", lat: -33.8650, lng: 151.2011 },
    { name: "Darling Harbour", city: "Sydney", category: "관광", lat: -33.8748, lng: 151.2007 },
    { name: "Surry Hills", city: "Sydney", category: "관광", lat: -33.8848, lng: 151.2114 },
    { name: "Royal Botanic Garden Sydney", city: "Sydney", category: "관광", lat: -33.8642, lng: 151.2166 },
    { name: "Queenstown Airport", city: "Queenstown", category: "공항", lat: -45.0211, lng: 168.7392 },
    { name: "Milford Sound", city: "Queenstown", category: "투어", lat: -44.6711, lng: 167.9263 },
    { name: "Crown Range", city: "Wanaka", category: "드라이브", lat: -44.9970, lng: 168.8938 },
    { name: "Cardrona", city: "Wanaka", category: "경유", lat: -44.8813, lng: 169.0027 },
    { name: "Church of the Good Shepherd", city: "Fairlie", category: "관광", lat: -44.0031, lng: 170.4822 },
    { name: "Geraldine", city: "Christchurch", category: "경유", lat: -44.0902, lng: 171.2446 },
    { name: "Cathedral Square", city: "Christchurch", category: "관광", lat: -43.5309, lng: 172.6365 },
    { name: "New Regent Street", city: "Christchurch", category: "관광", lat: -43.5290, lng: 172.6376 },
    { name: "Christchurch Airport", city: "Christchurch", category: "공항", lat: -43.4894, lng: 172.5322 },
    { name: "Auckland Airport", city: "Auckland", category: "공항", lat: -37.0082, lng: 174.7850 },
    { name: "Viaduct Harbour", city: "Auckland", category: "식사", lat: -36.8447, lng: 174.7589 }
];

const allPlaces = [...tripData.places, ...supplementalPlaces];

const routePlaceNamesByDate = {
    "2027-01-17": [
        "용인동백 두산위브더제니스",
        "인천국제공항 제2여객터미널",
        "대한항공 프레스티지 라운지(서편)"
    ],
    "2027-01-18": [
        "Meriton Suites Campbell Street",
        "Queen Victoria Building",
        "Sydney Fish Market",
        "Barangaroo",
        "Darling Harbour",
        "The Rocks",
        "Sydney Observatory",
        "Meriton Suites Campbell Street"
    ],
    "2027-01-19": [
        "Meriton Suites Campbell Street",
        "Surry Hills",
        "Bondi Beach",
        "Meriton Suites Campbell Street",
        "Royal Botanic Garden Sydney",
        "Sydney Opera House",
        "Meriton Suites Campbell Street"
    ],
    "2027-01-20": [
        "Meriton Suites Campbell Street",
        "Sydney Airport",
        "Queenstown Airport",
        "Queenstown Lakeview"
    ],
    "2027-01-21": ["Queenstown Lakeview", "Milford Sound", "Queenstown Lakeview"],
    "2027-01-22": ["Queenstown Lakeview"],
    "2027-01-23": [
        "Queenstown Lakeview",
        "Onsen Hot Pools",
        "Arrowtown",
        "Crown Range",
        "Cardrona",
        "Edgewater Wanaka",
        "That Wanaka Tree"
    ],
    "2027-01-24": [
        "Edgewater Wanaka",
        "Lake Pukaki",
        "Lake Tekapo",
        "Church of the Good Shepherd",
        "Fairlie"
    ],
    "2027-01-25": [
        "Fairlie",
        "Geraldine",
        "BreakFree on Cashel",
        "Riverside Market",
        "Cathedral Square",
        "New Regent Street"
    ],
    "2027-01-26": [
        "BreakFree on Cashel",
        "Christchurch Airport",
        "Auckland Airport",
        "Hilton Auckland",
        "Commercial Bay",
        "Viaduct Harbour"
    ],
    "2027-01-27": ["Hilton Auckland", "Rotorua", "Hilton Auckland"],
    "2027-01-28": [
        "Hilton Auckland",
        "Downtown Ferry Terminal",
        "Waiheke Island",
        "Hilton Auckland"
    ],
    "2027-01-29": ["Hilton Auckland", "Auckland Airport"]
};

const schedulePlaceOverrides = {
    "2027-01-17|03:15": "용인동백 두산위브더제니스",
    "2027-01-17|05:00": "인천국제공항 제2여객터미널",
    "2027-01-17|05:10": "인천국제공항 제2여객터미널",
    "2027-01-17|06:00": "대한항공 프레스티지 라운지(서편)",
    "2027-01-17|07:20": "인천국제공항 제2여객터미널",
    "2027-01-17|08:00": "인천국제공항 제2여객터미널",
    "2027-01-18|10:00": "Queen Victoria Building",
    "2027-01-18|12:00": "Sydney Fish Market",
    "2027-01-18|14:00": "Barangaroo",
    "2027-01-18|16:30": "The Rocks",
    "2027-01-18|19:30": "Sydney Observatory",
    "2027-01-19|10:00": "Surry Hills",
    "2027-01-19|12:00": "Bondi Beach",
    "2027-01-19|15:30": "Meriton Suites Campbell Street",
    "2027-01-19|17:00": "Royal Botanic Garden Sydney",
    "2027-01-19|18:30": "Sydney Opera House",
    "2027-01-20|07:30": "Sydney Airport",
    "2027-01-20|10:55": "Sydney Airport",
    "2027-01-20|16:00": "Queenstown Airport",
    "2027-01-20|18:00": "Queenstown Lakeview",
    "2027-01-21|07:00": "Milford Sound",
    "2027-01-21|20:00": "Queenstown Lakeview",
    "2027-01-23|08:45": "Onsen Hot Pools",
    "2027-01-23|09:00": "Onsen Hot Pools",
    "2027-01-23|10:30": "Arrowtown",
    "2027-01-23|12:30": "Crown Range",
    "2027-01-23|15:00": "Edgewater Wanaka",
    "2027-01-23|17:00": "That Wanaka Tree",
    "2027-01-24|09:30": "Edgewater Wanaka",
    "2027-01-24|12:00": "Lake Pukaki",
    "2027-01-24|15:00": "Lake Tekapo",
    "2027-01-24|15:30": "Church of the Good Shepherd",
    "2027-01-24|19:00": "Fairlie",
    "2027-01-25|09:30": "Fairlie",
    "2027-01-25|10:30": "Geraldine",
    "2027-01-25|13:30": "BreakFree on Cashel",
    "2027-01-25|16:00": "Riverside Market",
    "2027-01-26|09:30": "Christchurch Airport",
    "2027-01-26|12:00": "Christchurch Airport",
    "2027-01-26|13:25": "Auckland Airport",
    "2027-01-26|15:00": "Hilton Auckland",
    "2027-01-26|17:00": "Commercial Bay",
    "2027-01-26|19:00": "Viaduct Harbour",
    "2027-01-27|07:00": "Rotorua",
    "2027-01-27|20:00": "Hilton Auckland",
    "2027-01-28|09:30": "Downtown Ferry Terminal",
    "2027-01-28|10:30": "Waiheke Island",
    "2027-01-28|17:30": "Downtown Ferry Terminal",
    "2027-01-29|08:00": "Auckland Airport",
    "2027-01-29|11:45": "Auckland Airport"
};

const getDay = (date) => tripData.days.find((day) => day.date === date);
const findPlace = (name) => allPlaces.find((place) => place.name === name);
const getRoutePlaces = (date) => (routePlaceNamesByDate[date] || []).map(findPlace).filter(Boolean);

const placeQuery = (place) => `${place.name}, ${place.city}`;

const googleMapsPlaceUrl = (place) => {
    const query = encodeURIComponent(placeQuery(place));
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
};

const googleMapsRouteUrl = (places) => {
    if (places.length === 0) return "https://www.google.com/maps";
    if (places.length === 1) return googleMapsPlaceUrl(places[0]);

    const origin = placeQuery(places[0]);
    const destination = placeQuery(places[places.length - 1]);
    const middle = places.slice(1, -1).map(placeQuery);
    const params = new URLSearchParams({ api: "1", origin, destination });

    if (middle.length > 0) {
        params.set("waypoints", middle.join("|"));
    }

    return `https://www.google.com/maps/dir/?${params.toString()}`;
};

const normalizePlaceText = (value) => String(value)
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]/g, "");

const getScheduleItemPlace = (date, item) => {
    const override = schedulePlaceOverrides[`${date}|${item.time}`];
    if (override) return findPlace(override) || null;

    const normalizedTitle = normalizePlaceText(item.title);
    const candidates = allPlaces
        .filter((place) => {
            const normalizedPlace = normalizePlaceText(place.name);
            return normalizedPlace.length >= 4 && normalizedTitle.includes(normalizedPlace);
        })
        .sort((a, b) => b.name.length - a.name.length);

    return candidates[0] || null;
};

const uniquePlaces = (places) => {
    const seen = new Set();
    return places.filter((place) => {
        if (!place || seen.has(place.name)) return false;
        seen.add(place.name);
        return true;
    });
};

const makeScheduleMarkerIcon = (number, active = false) => L.divIcon({
    className: "",
    html: `<div class="schedule-map-marker ${active ? "active" : ""}">${number}</div>`,
    iconSize: active ? [38, 38] : [30, 30],
    iconAnchor: active ? [19, 19] : [15, 15]
});

const renderCountdown = () => {
    if (tripState.mode === "before") {
        countdownValue.textContent = tripState.countdown === 0 ? "D-DAY" : `D-${tripState.countdown}`;
        countdownCaption.textContent = "until departure";
        return;
    }

    if (tripState.mode === "during") {
        countdownValue.textContent = "ON TRIP";
        countdownCaption.textContent = "honeymoon days";
        return;
    }

    countdownValue.textContent = "MEMORIES";
    countdownCaption.textContent = "trip complete";
};

const renderHomeFocus = () => {
    const day = getDay(tripState.focusDate) || tripData.days[0];
    const visibleItems = day.items.slice(0, 5);

    homeFocus.innerHTML = `
        <article class="focus-card">
            <div class="focus-card__top">
                <div>
                    <p class="focus-card__label">${escapeHtml(tripState.label)}</p>
                    <h2>${escapeHtml(day.title)}</h2>
                    <p class="focus-card__city">${escapeHtml(day.city)}</p>
                </div>
                <span class="focus-card__date">${escapeHtml(day.label)}</span>
            </div>
            <ul class="focus-list">
                ${visibleItems.map((item) => `
                    <li class="focus-item">
                        <time>${escapeHtml(item.time)}</time>
                        <div>
                            <strong>${escapeHtml(item.title)}</strong>
                            ${item.note ? `<small>${escapeHtml(item.note)}</small>` : ""}
                        </div>
                    </li>
                `).join("")}
            </ul>
            <div class="focus-card__actions">
                <button type="button" class="primary-button" data-focus-action="schedule">일정 자세히</button>
                <button type="button" class="secondary-button" data-focus-action="map">동선 보기</button>
            </div>
        </article>
    `;

    document.querySelectorAll("[data-focus-action]").forEach((button) => {
        button.addEventListener("click", () => {
            selectedDate = day.date;
            selectedSchedulePlaceName = null;
            renderDateStrips();
            renderSelectedDay();
            renderRoute();
            activateTab(button.dataset.focusAction);
        });
    });
};

const renderJourney = () => {
    journeyStrip.innerHTML = tripData.hotels.map((hotel, index) => `
        <article class="journey-stop">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <strong>${escapeHtml(hotel.city)}</strong>
            <small>${escapeHtml(hotel.dates)}</small>
        </article>
    `).join("");
};

const weekdayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const renderDateStripInto = (container) => {
    if (!container) return;

    container.innerHTML = tripData.days.map((day) => {
        const date = new Date(`${day.date}T00:00:00`);
        const dayNumber = Number(day.date.slice(-2));
        const weekday = weekdayNames[date.getDay()];
        const shortCity = day.city.slice(0, 3).toUpperCase();

        return `
            <button
                type="button"
                class="date-button ${day.date === selectedDate ? "active" : ""}"
                data-date="${day.date}"
                aria-label="${escapeHtml(day.label)} ${escapeHtml(day.title)}"
            >
                <span>${weekday}</span>
                <strong>${dayNumber}</strong>
                <small>${escapeHtml(shortCity)}</small>
            </button>
        `;
    }).join("");

    container.querySelectorAll(".date-button").forEach((button) => {
        button.addEventListener("click", () => {
            selectedDate = button.dataset.date;
            selectedSchedulePlaceName = null;
            renderDateStrips();
            renderSelectedDay();
            renderRoute();
        });
    });

    requestAnimationFrame(() => {
        container.querySelector(`.date-button[data-date="${selectedDate}"]`)
            ?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    });
};

const renderDateStrips = () => {
    renderDateStripInto(dateStrip);
    renderDateStripInto(routeDateStrip);
};

const updateScheduleTimelineSelection = () => {
    document.querySelectorAll(".timeline-item[data-schedule-place]").forEach((item) => {
        const isActive = item.dataset.schedulePlace === selectedSchedulePlaceName;
        item.classList.toggle("timeline-item--selected", isActive);
        item.setAttribute("aria-pressed", String(isActive));
    });

    const place = findPlace(selectedSchedulePlaceName);
    const selectedLabel = document.querySelector("#schedule-map-selected");
    const selectedLink = document.querySelector("#schedule-map-place-link");

    if (selectedLabel) {
        selectedLabel.textContent = place ? `${place.name} · ${place.city}` : "일정을 선택해 위치를 확인하세요.";
    }

    if (selectedLink) {
        selectedLink.hidden = !place;
        if (place) selectedLink.href = googleMapsPlaceUrl(place);
    }
};

const focusScheduleMapPlace = (place, animate = true) => {
    if (!place || !scheduleMap || !Number.isFinite(place.lat) || !Number.isFinite(place.lng)) return;

    scheduleMarkers.forEach(({ marker, number }, placeName) => {
        marker.setIcon(makeScheduleMarkerIcon(number, placeName === place.name));
        marker.setZIndexOffset(placeName === place.name ? 1000 : 0);
    });

    const selectedMarker = scheduleMarkers.get(place.name)?.marker;
    if (selectedMarker) selectedMarker.openPopup();

    const target = [place.lat, place.lng];
    if (animate) {
        scheduleMap.flyTo(target, Math.max(scheduleMap.getZoom(), 14), { duration: 0.45 });
    } else {
        scheduleMap.setView(target, Math.max(scheduleMap.getZoom(), 14));
    }
};

const initializeScheduleMap = () => {
    const mapContainer = document.querySelector("#schedule-day-map");
    if (!mapContainer) return;

    if (scheduleMap) {
        scheduleMap.remove();
        scheduleMap = null;
    }
    scheduleMarkers = new Map();

    const places = uniquePlaces(getRoutePlaces(selectedDate))
        .filter((place) => Number.isFinite(place.lat) && Number.isFinite(place.lng));

    if (!window.L) {
        mapContainer.classList.add("schedule-day-map--error");
        mapContainer.innerHTML = "지도를 불러오지 못했습니다. Google Maps 버튼을 이용해주세요.";
        return;
    }

    if (places.length === 0) {
        mapContainer.classList.add("schedule-day-map--error");
        mapContainer.innerHTML = "이 날짜에 지도 위치가 아직 등록되지 않았습니다.";
        return;
    }

    mapContainer.classList.remove("schedule-day-map--error");
    mapContainer.innerHTML = "";

    try {
        scheduleMap = L.map(mapContainer, {
            scrollWheelZoom: false,
            zoomControl: true,
            attributionControl: true
        });

        L.tileLayer(
            "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
            {
                subdomains: "abcd",
                maxZoom: 20,
                attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
            }
        ).addTo(scheduleMap);

        const bounds = [];

        places.forEach((place, index) => {
            const number = index + 1;
            const marker = L.marker([place.lat, place.lng], {
                icon: makeScheduleMarkerIcon(number, place.name === selectedSchedulePlaceName)
            }).addTo(scheduleMap);

            marker.bindPopup(`
                <div class="schedule-map-popup">
                    <small>${escapeHtml(place.category || "장소")}</small>
                    <strong>${escapeHtml(place.name)}</strong>
                    <a href="${googleMapsPlaceUrl(place)}" target="_blank" rel="noopener noreferrer">Google Maps ↗</a>
                </div>
            `);

            marker.on("click", () => {
                selectedSchedulePlaceName = place.name;
                updateScheduleTimelineSelection();
                focusScheduleMapPlace(place, false);
            });

            scheduleMarkers.set(place.name, { marker, number });
            bounds.push([place.lat, place.lng]);
        });

        if (bounds.length === 1) {
            scheduleMap.setView(bounds[0], 14);
        } else {
            scheduleMap.fitBounds(bounds, { padding: [34, 34] });
        }

        const selectedPlace = findPlace(selectedSchedulePlaceName);
        if (selectedPlace && scheduleMarkers.has(selectedPlace.name)) {
            focusScheduleMapPlace(selectedPlace, false);
        }

        setTimeout(() => scheduleMap?.invalidateSize(), 80);
    } catch (error) {
        console.error("Schedule map initialization failed:", error);
        mapContainer.classList.add("schedule-day-map--error");
        mapContainer.innerHTML = "지도를 표시하는 중 오류가 발생했습니다. Google Maps 버튼을 이용해주세요.";
    }
};

const bindScheduleTimelineMapClicks = () => {
    document.querySelectorAll(".timeline-item[data-schedule-place]").forEach((item) => {
        const activate = () => {
            const place = findPlace(item.dataset.schedulePlace);
            if (!place) return;
            selectedSchedulePlaceName = place.name;
            updateScheduleTimelineSelection();
            focusScheduleMapPlace(place, true);
            document.querySelector("#schedule-map-block")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        };

        item.addEventListener("click", activate);
        item.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                activate();
            }
        });
    });
};

const renderSelectedDay = () => {
    const day = getDay(selectedDate) || tripData.days[0];
    const mappedItems = day.items.map((item) => ({
        item,
        place: getScheduleItemPlace(day.date, item)
    }));

    const availablePlaces = mappedItems.map(({ place }) => place).filter(Boolean);
    if (!availablePlaces.some((place) => place.name === selectedSchedulePlaceName)) {
        selectedSchedulePlaceName = availablePlaces[0]?.name || null;
    }

    const planLabels = { fixed: "고정", planned: "계획", candidate: "후보" };
    const items = mappedItems.map(({ item, place }) => `
        <li
            class="timeline-item ${place ? "timeline-item--mappable" : ""} ${place?.name === selectedSchedulePlaceName ? "timeline-item--selected" : ""}"
            ${place ? `data-schedule-place="${escapeHtml(place.name)}" role="button" tabindex="0" aria-pressed="${place.name === selectedSchedulePlaceName}"` : ""}
        >
            <div class="timeline-time">${escapeHtml(item.time)}</div>
            <div class="timeline-content">
                <div class="timeline-meta">
                    <span class="type-badge type-${escapeHtml(item.type)}">${getTypeLabel(item.type)}</span>
                    <span class="plan-status plan-status--${escapeHtml(item.planStatus || (item.fixed ? "fixed" : "candidate"))}">${planLabels[item.planStatus || (item.fixed ? "fixed" : "candidate")] || "후보"}</span>
                    ${place ? '<span class="map-ready-badge">지도</span>' : ""}
                </div>
                <strong>${escapeHtml(item.title)}</strong>
                ${item.note ? `<p>${escapeHtml(item.note)}</p>` : ""}
            </div>
        </li>
    `).join("");

    const routePlaces = getRoutePlaces(selectedDate);
    const selectedPlace = findPlace(selectedSchedulePlaceName);

    if (scheduleMap) {
        scheduleMap.remove();
        scheduleMap = null;
    }

    selectedDay.innerHTML = `
        <article class="day-detail">
            <div class="day-detail__header">
                <div>
                    <p class="section-kicker">${escapeHtml(day.label)}</p>
                    <h3>${escapeHtml(day.title)}</h3>
                    <p class="day-detail__city">${escapeHtml(day.city)}</p>
                </div>
                <div class="intensity" title="일정 강도 ${day.intensity}/5">
                    ${Array.from({ length: 5 }, (_, index) => (
                        `<span class="intensity-dot ${index < day.intensity ? "active" : ""}"></span>`
                    )).join("")}
                </div>
            </div>
            <div class="schedule-plan-legend" aria-label="일정 상태 설명">
                <span>고정 · 예약/운영 시각</span>
                <span>계획 · 시간 조정 가능</span>
                <span>후보 · 검토 중</span>
            </div>
            <ul class="timeline">${items}</ul>
        </article>

        <section id="schedule-map-block" class="schedule-map-block">
            <div class="schedule-map-head">
                <div>
                    <p class="section-kicker">DAY MAP</p>
                    <h3>일정 위치</h3>
                    <p id="schedule-map-selected">${selectedPlace ? `${escapeHtml(selectedPlace.name)} · ${escapeHtml(selectedPlace.city)}` : "일정을 선택해 위치를 확인하세요."}</p>
                </div>
                <div class="schedule-map-actions">
                    <a
                        id="schedule-map-place-link"
                        class="schedule-map-link secondary"
                        href="${selectedPlace ? googleMapsPlaceUrl(selectedPlace) : "#"}"
                        target="_blank"
                        rel="noopener noreferrer"
                        ${selectedPlace ? "" : "hidden"}
                    >선택 장소 ↗</a>
                    <a
                        class="schedule-map-link"
                        href="${googleMapsRouteUrl(routePlaces)}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >전체 동선 ↗</a>
                </div>
            </div>
            <div id="schedule-day-map" class="schedule-day-map" aria-label="선택한 날짜의 일정 지도"></div>
            <p class="helper-text">지도 표시가 있는 일정을 누르면 해당 위치가 강조됩니다. 전체 동선은 Google Maps에서 열 수 있습니다.</p>
        </section>
    `;

    bindScheduleTimelineMapClicks();

    if (document.querySelector("#schedule-panel")?.classList.contains("active")
        && !document.querySelector("#schedule-day-view")?.hidden) {
        setTimeout(() => {
            initializeScheduleMap();
            updateScheduleTimelineSelection();
        }, 40);
    }
};

const renderRoute = () => {
    const day = getDay(selectedDate) || tripData.days[0];
    const places = getRoutePlaces(selectedDate);

    routeSummary.innerHTML = `
        <article class="route-head-card">
            <div>
                <p class="section-kicker">${escapeHtml(day.label)}</p>
                <h3>${escapeHtml(day.title)}</h3>
                <p>${escapeHtml(day.city)} · ${places.length} stops</p>
            </div>
            <a
                class="google-route-button"
                href="${googleMapsRouteUrl(places)}"
                target="_blank"
                rel="noopener noreferrer"
            >
                <span>Google Maps</span>
                <strong>전체 동선 열기 ↗</strong>
            </a>
        </article>
    `;

    if (places.length === 0) {
        routeList.innerHTML = '<div class="route-empty">등록된 동선 장소가 아직 없습니다.</div>';
        return;
    }

    routeList.innerHTML = places.map((place, index) => `
        <article class="route-stop-card">
            <div class="route-sequence">
                <span>${index + 1}</span>
                ${index < places.length - 1 ? '<i aria-hidden="true"></i>' : ""}
            </div>
            <div class="route-stop-content">
                <small>${escapeHtml(place.category || "장소")}</small>
                <strong>${escapeHtml(place.name)}</strong>
                <span>${escapeHtml(place.city)}</span>
            </div>
            <a
                class="route-place-button"
                href="${googleMapsPlaceUrl(place)}"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="${escapeHtml(place.name)} Google Maps에서 열기"
            >지도 ↗</a>
        </article>
    `).join("");
};

const renderBookings = () => {
    const flightTotal = tripData.flights.reduce((sum, item) => sum + item.price, 0);
    const hotelTotal = tripData.hotels.reduce((sum, item) => sum + item.price, 0);

    bookingSummary.innerHTML = `
        <article class="booking-stat"><span>FLIGHTS</span><strong>${tripData.flights.length}</strong></article>
        <article class="booking-stat"><span>STAYS</span><strong>${tripData.hotels.length}</strong></article>
        <article class="booking-stat"><span>CONFIRMED</span><strong>${formatKrw(flightTotal + hotelTotal)}</strong></article>
    `;

    flightList.innerHTML = `
        <h3 class="subsection-title">Flights</h3>
        ${tripData.flights.map((flight) => `
            <article class="booking-card">
                <div class="booking-date">${escapeHtml(flight.date)}</div>
                <div class="booking-content">
                    <strong>${escapeHtml(flight.route)}</strong>
                    <span>${escapeHtml(flight.time)}</span>
                    <small>${escapeHtml(flight.airline)}</small>
                </div>
                <div class="booking-price">${formatKrw(flight.price)}</div>
            </article>
        `).join("")}
    `;

    hotelList.innerHTML = `
        <h3 class="subsection-title">Stays</h3>
        ${tripData.hotels.map((hotel) => `
            <article class="booking-card">
                <div class="booking-date">${escapeHtml(hotel.city.slice(0, 3).toUpperCase())}</div>
                <div class="booking-content">
                    <strong>${escapeHtml(hotel.name)}</strong>
                    <span>${escapeHtml(hotel.dates)}</span>
                    <small>${escapeHtml(hotel.city)}</small>
                </div>
                <div class="booking-price">${formatKrw(hotel.price)}</div>
            </article>
        `).join("")}
    `;
};

const renderBudget = () => {
    const fixedTotal = tripData.budget
        .filter((item) => item.status === "확정")
        .reduce((sum, item) => sum + item.amount, 0);
    const estimatedTotal = tripData.budget.reduce((sum, item) => sum + item.amount, 0);
    const remaining = estimatedTotal - fixedTotal;

    budgetSummary.innerHTML = `
        <article class="budget-highlight"><span>현재 확정</span><strong>${formatKrw(fixedTotal)}</strong></article>
        <article class="budget-highlight main"><span>예상 총액</span><strong>${formatKrw(estimatedTotal)}</strong><small>쇼핑 제외</small></article>
        <article class="budget-highlight"><span>추가 예상</span><strong>${formatKrw(remaining)}</strong></article>
    `;

    budgetList.innerHTML = tripData.budget.map((item) => `
        <div class="budget-row">
            <div>
                <strong>${escapeHtml(item.name)}</strong>
                <span class="status status-${item.status === "확정" ? "fixed" : "estimate"}">${escapeHtml(item.status)}</span>
                ${item.range ? `<p>${escapeHtml(item.range)}</p>` : ""}
            </div>
            <strong>${formatKrw(item.amount)}</strong>
        </div>
    `).join("");
};

const renderShopping = () => {
    shoppingList.innerHTML = tripData.shopping.map((gift, index) => `
        <label class="shopping-item">
            <input type="checkbox" data-gift-id="${index}">
            <span class="shopping-check"></span>
            <span class="shopping-content">
                <strong>${escapeHtml(gift.item)}</strong>
                <span>${escapeHtml(gift.target)}</span>
                <small>${escapeHtml(gift.place)}</small>
            </span>
        </label>
    `).join("");

    document.querySelectorAll("[data-gift-id]").forEach((checkbox) => {
        const storageKey = `honeymoon-gift-${checkbox.dataset.giftId}`;
        checkbox.checked = localStorage.getItem(storageKey) === "true";
        checkbox.addEventListener("change", () => {
            localStorage.setItem(storageKey, checkbox.checked);
        });
    });
};

const activateTab = (tabName) => {
    document.querySelectorAll(".nav-button").forEach((button) => {
        button.classList.toggle("active", button.dataset.tab === tabName);
    });

    document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));
    document.querySelector(`#${tabName}-panel`)?.classList.add("active");

    if (tabName === "schedule") {
        renderDateStrips();
        renderSelectedDay();
        setTimeout(() => {
            if (document.querySelector("#schedule-day-view")?.hidden) return;
            initializeScheduleMap();
            updateScheduleTimelineSelection();
        }, 60);
    }

    if (tabName === "map") {
        renderDateStrips();
        renderRoute();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
};

document.querySelectorAll(".nav-button").forEach((button) => {
    button.addEventListener("click", () => activateTab(button.dataset.tab));
});

document.querySelectorAll("[data-go-tab]").forEach((button) => {
    button.addEventListener("click", () => activateTab(button.dataset.goTab));
});

document.querySelector("#jump-today")?.addEventListener("click", () => {
    selectedDate = tripState.focusDate;
    selectedSchedulePlaceName = null;
    renderDateStrips();
    renderSelectedDay();
});

document.querySelector("#route-today")?.addEventListener("click", () => {
    selectedDate = tripState.focusDate;
    selectedSchedulePlaceName = null;
    renderDateStrips();
    renderRoute();
});

renderCountdown();
renderHomeFocus();
renderJourney();
renderDateStrips();
renderSelectedDay();
renderRoute();
renderBookings();
renderBudget();
renderShopping();
