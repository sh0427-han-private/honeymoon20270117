# Honeymoon Web App — Design System

Last updated: 2026-08-25

## Direction

The visual direction is a hybrid of premium editorial design and a practical mobile travel app.

Reference research source: Refero Styles (`https://styles.refero.design/`). The site does not copy a single Refero design. Instead it borrows general patterns commonly found in strong product/editorial systems:

- a compact atmospheric hero on the home screen only, followed by clean UI
- oversized serif display typography paired with restrained system sans-serif UI text
- thin 1px rules instead of heavy card shadows
- generous spacing and fewer visual containers
- floating pill navigation
- active states expressed through one clear accent rather than many decorative colors
- high information density only where useful, especially schedule/route views

## Current V5 visual language

### Canvas

- warm paper background: `#f4f2ec`
- paper surface: `#fcfbf7`
- near-black ink: `#181915`
- muted text: `#77786f`

### Accent colors

Use accents functionally, not decoratively.

- sage: navigation / map-support context
- muted sky: flight information
- peach: editorial emphasis and tour moments
- yellow: selected map pin / selected itinerary location only

### Typography

No external web fonts are required. This keeps loading light during travel.

- Editorial/display: Georgia / Times New Roman fallback
- UI/body: system font stack
- Times and sequence numbers: monospace system stack

### Shape and elevation

- hero: 28px radius, atmospheric gradient, no image
- major information panels: 22px radius at most
- list-heavy screens: prefer flat rows and divider lines instead of cards
- controls and bottom navigation: full pill radius
- shadows: minimal; primarily floating bottom navigation only

## Home

The home screen behaves like a travel magazine cover followed by an app dashboard.

Hero:

- HONEYMOON EDITION label
- Australia & New Zealand single-line, smaller editorial headline on home
- travel dates and city route
- compact departure and return date pair (2027-01-17 / 2027-01-29); no D-day or total trip duration statistics in the header

Below hero:

- next/today itinerary card
- three quick actions: schedule / booking / packing checklist
- accommodation journey displayed as a compact horizontal route line with small muted Korean night counts (3박/1박), not heavy cards

No photography is used to preserve speed and consistency.

## Schedule

- horizontally scrollable pill date selector
- selected day shown as a flat editorial timeline
- schedule type badges are subtle semantic colors
- mappable rows are tappable
- selected schedule row gets a yellow/ink map-selection accent
- day map is rendered directly under the schedule
- clicking a mappable schedule item highlights and zooms the corresponding marker
- Google Maps links remain available for the selected location and full route

## Route

- route overview is a flat section separated by rules
- stops use numbered square markers + connecting line
- Google Maps opens the real route externally
- the dedicated route tab is kept for full-day route review, while the schedule tab remains the main travel view

## Bookings / Budget / Gifts

These sections use flat, table-like rows rather than card grids wherever possible.

Priority is scanability:

1. label
2. primary value/name
3. secondary metadata

## Mobile navigation

Bottom navigation is a floating white translucent pill with one black active pill. Use exactly four equal-width items matching the rendered tabs.

Tabs:

- 홈
- 일정
- 예약
- 더보기

## Performance rules

- do not add destination photography by default
- avoid external fonts
- keep itinerary data in `itinerary.js`
- do not introduce a framework unless the app genuinely needs it
- keep Leaflet/CARTO map as progressive enhancement; Google Maps links must remain usable if map tiles fail

## Future design changes

When adjusting the UI, preserve these priorities in order:

1. travel-day usability
2. mobile scanability
3. fast loading
4. editorial honeymoon mood
5. decorative polish
