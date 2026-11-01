# Honeymoon 2027

Australia & New Zealand honeymoon itinerary for January 17–29, 2027.

## Start here

When continuing this project in a new ChatGPT conversation or a new work session, read these files first:

1. **`PROJECT_CONTEXT.md`** — persistent trip context, fixed constraints, decisions, budget assumptions, shopping strategy, TODOs
2. **`itinerary.js`** — canonical data currently rendered by the web app
3. **`README.md`** — current product/design direction

Recommended continuation prompt:

> GitHub `sh0427-han/honeymoon20270117` 레포의 `PROJECT_CONTEXT.md`와 `itinerary.js`를 먼저 읽고 신혼여행 프로젝트를 이어서 작업해줘.

## Current design direction — V2

The selected UI direction is **Hybrid D: Luxury Editorial + Clean Travel App**.

- The landing/home experience should feel like a refined honeymoon travel journal.
- Daily use should remain compact, fast, and app-like.
- **Do not use destination photos**. Performance on roaming/mobile networks is more important than photography.
- Use system fonts where possible; the editorial English display type can use local serif fallbacks such as Georgia.
- Mobile-first navigation: `홈 / 일정 / 예약 / 더보기` (4 equally sized tabs).
- The home header shows only the departure (17 Jan) and return (29 Jan) dates, without D-day or duration statistics.
- During the trip, the home screen automatically emphasizes today's itinerary.
- The schedule view shows one selected day at a time with a horizontal date selector.
- The map supports both **selected-day route** and **whole-trip** modes.
- Leaflet map failures must never block access to place information: always keep Google Maps fallback links visible.
- Daily map markers use HTML/number markers instead of Leaflet image-marker assets to reduce external asset failure points.

## Goals

- Mobile-first itinerary for use during the trip
- Daily timeline with transport, sightseeing, meals, and notes
- Quick access to accommodation and place map links
- Fixed tour highlights: Milford Sound, Onsen Hot Pools, Rotorua
- Budget overview and gift-shopping checklist
- Persistent project context for future ChatGPT sessions

## Privacy

This repository is currently public. Do not store passport numbers, booking references, payment details, phone numbers, email addresses, insurance policy numbers, or other sensitive information in the repository.

## Structure

- `index.html`: V2 page shell and navigation
- `styles.css`: responsive editorial/travel-app styling
- `itinerary.js`: canonical trip data
- `app.js`: rendering, trip-date/today state, day selector, map modes, budget, shopping interactions
- `packing-data.js`: 여행 지역별 옷차림과 2인·공용 준비물 기준 목록
- `packing-checklist.js` / `packing-checklist.css`: 더보기 > 준비물, 사용자별 체크리스트 UI (체크는 기기별 localStorage; 서버·Google Drive 자동 동기화 없음)
- `PROJECT_CONTEXT.md`: long-term context and decision log
- `README.md`: project entry point and current design direction

## Map implementation

- Leaflet 1.9.4 + OpenStreetMap tiles
- Official Leaflet CSS/JS integrity hashes
- Selected-day route view uses numbered HTML markers and a sequence line
- Whole-trip map uses compact markers
- Google Maps links are rendered below the map as a fallback even when Leaflet fails to load

## Run

Open `index.html` in a browser, or publish the repository with GitHub Pages.
