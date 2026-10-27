# Honeymoon 2027 — Project Context

> 새 ChatGPT 대화나 작업 세션에서 프로젝트 맥락을 복구하기 위한 기준 문서다.
> 작업 시작 시 **이 파일을 먼저 읽고, 실제 웹앱 일정 데이터는 `itinerary.js`를 함께 확인**한다.
> 사용자의 최신 요청이 이 문서와 충돌하면 최신 요청이 우선한다.
>
> 마지막 정리 기준: 2026-10-27 · V42

---

## 1. 프로젝트 목적 / 운영 원칙

- 여행 기간: **2027-01-17 ~ 2027-01-29**
- 인원: 2명
- 흐름: Korea → Sydney → Queenstown → Wanaka → Fairlie → Christchurch → Auckland → Korea
- Repository: `sh0427-han-private/honeymoon20270117` (사용자 확인: Public 전환 및 Pages 배포 설정 완료)
- 배포: Public GitHub repository + GitHub Pages
- 사이트: GitHub Pages 배포 완료(사용자 확인). 기존 이전 계정 Pages URL은 사용하지 않음; 현재 URL은 배포 설정에서 확인
- `itinerary.js`: 실제 웹앱 일정 canonical source
- `booking-data.js`: 예약 문서 / 현지 결제 / Drive 링크 기본 데이터
- `reservation-data-v32.js`: Milford 예약 세부정보 보강
- `reservation-data-v33.js`: Fairlie Airbnb 문서/결제 상태 보강
- `PROJECT_CONTEXT.md`: 확정사항 / 의사결정 / TODO 요약
- 민감한 예약번호, QR/바코드, 카드/여권/개인 연락처 등은 Public GitHub에 저장하지 않는다.
- 실제 예약확인서 원본은 Restricted Google Drive에서 관리한다.

---

## 2. 확정 항공

| 날짜 | 시간 | 구간 | 항공사 | 가격 |
|---|---|---|---|---:|
| 1/17 | 08:00 → 20:05 | ICN → SYD | Korean Air Business | ₩4,994,400 |
| 1/20 | 10:55 → 16:00 | SYD → ZQN | Air New Zealand | ₩918,400 |
| 1/26 | 12:00 → 13:25 | CHC → AKL | Air New Zealand | ₩246,000 |
| 1/29 | 11:45 → 19:40 | AKL → ICN | Korean Air | ₩2,003,800 |

항공 총액: **₩8,162,600**

항공 영수증은 웹앱에서 제외하고 티켓 문서만 노출한다.

- 1/17 ICN→SYD: 상훈 / 진영 티켓 각각 연결
- 1/20 SYD→ZQN: 두 사람 공용 티켓 1개
- 1/26 CHC→AKL: 한/영 통합 공용 티켓 1개
- 1/29 AKL→ICN: 상훈 / 진영 티켓 각각 연결
- 현재 항공 문서: **6 / 6 연결**
- V33부터 개별 승객 티켓 2개가 있는 노선은 **상훈이 티켓 / 진영이 티켓을 위아래 세로 배치**한다. 모바일에서 우측 스크롤로 확인하지 않도록 한다.

---

## 3. 확정 숙소 — 변경 추천 금지

| 날짜 | 지역 | 숙소 | 가격 |
|---|---|---|---:|
| 1/17 → 1/20 | Sydney | Meriton Suites Campbell Street | ₩811,000 |
| 1/20 → 1/23 | Queenstown | Hampshire Holiday Parks Queenstown Lakeview | ₩734,799 |
| 1/23 → 1/24 | Wanaka | Edgewater Hotel | ₩483,929 |
| 1/24 → 1/25 | Fairlie | Airbnb | ₩391,259 |
| 1/25 → 1/26 | Christchurch | BreakFree on Cashel | ₩105,905 |
| 1/26 → 1/29 | Auckland | Hilton Auckland | ₩1,461,663 |

숙박 총액: **₩3,988,555**

항공 + 숙박 확정금액: **₩12,151,155**

현재 숙박 문서:

- Meriton: 한글 + 영문 바우처
- Queenstown Lakeview: 한글 + 영문 바우처 + 영수증
- Edgewater: 한글 + 영문 바우처 + 영수증
- Fairlie Airbnb: **예약·결제 확인서 연결** (`20270124-20270125_FAIRLIE_AIRBNB_RECEIPT.pdf`)
- BreakFree: 한글 + 영문 바우처 + 영수증
- Hilton Auckland: 한글 + 영문 바우처 + 영수증
- 현재 숙박 문서: **15 / 15 연결**

### Fairlie Airbnb — 최신 문서 기준

- 숙박: **2027-01-24 → 2027-01-25 · Fairlie 1박**
- 결제: **₩391,259 선결제 완료**
- 결제 문서는 `02_Stays/20270124-20270125_FAIRLIE_AIRBNB_RECEIPT.pdf`
- 웹앱에서는 `예약·결제 확인서`로 연결한다.
- Public GitHub에는 Airbnb 확인 코드, 예약번호 등 민감정보를 저장하지 않는다.
- **실제 예약 인원은 2명으로 변경 완료(사용자 확인)**. 기존 Airbnb 문서에는 여전히 `게스트 1명`으로 표시되므로 최신 2명 예약확인서만 갱신하면 된다.

---

## 4. 핵심 경험 / 투어

고정:

1. **Milford Sound Coach & Nature Cruise — Southern Discoveries** — 1/21 · 예약 완료
2. **Onsen Hot Pools** — 1/23 09:00 · 예약 및 NZD 180 결제 완료(사용자 확인)
3. **Rotorua Day Tour** — 1/27 방문 계획 · 상품·픽업/출발 시각 미확정, 미예약

선호:

- Waiheke Island — 1/28

### Onsen Hot Pools — 예약·결제 확인

- 일정: **2027-01-23 (토) 08:45 체크인 · 09:00 이용 시작**
- 상품: **Original Onsen – Soak Only**, 성인 **2명**
- 예약 총액: **NZD 180.00**
- 결제 상태: **사용자가 결제 완료로 확인**. 카드 원화 실청구액과 결제수단은 미확인.
- Drive 문서: `03_Tours/20270123_ONSEN_HOT_POOLS_BOOKING.jpg` (예약확인서)
- 예약자명·예약번호 등 민감한 정보는 GitHub 본문에 저장하지 않는다.
- 웹앱 `booking-data.js`: `onsen` 예약 완료, `payment.status="paid"`, `paidAmount=180`, 현지 결제 필요금액 0, 제한 접근 예약확인서 연결. 예약 탭에 `결제 완료 · NZD 180` 표시

### Milford Sound — 최신 예약 기준

예약확인서 + Southern Discoveries 공식 상품 시간표 기준으로 운영한다.

- 날짜: **2027-01-21**
- 상품: **Milford Sound Coach & Nature Cruise ex Queenstown**
- 성인 2명
- **06:35** Hampshire Holiday Parks Queenstown Lakeview 리셉션 대기
- **06:45** 숙소에서 택시 픽업
- 택시 이동 → **Southern Discoveries Queenstown Visitor Centre**
  - St Omer Wharf, **110 Beach Street, Queenstown 9300**
- **07:00** Queenstown Visitor Centre에서 코치 출발 — Southern Discoveries 공식 상품 일정 기준
- Milford Road 이동 + Nature Cruise
- **To Kai Lunch 2인 포함**
- 한국어 포함 Multi-Language Coach Commentary 앱 사용 가능 · 이어폰 필요
- **19:30 예정** Southern Discoveries Queenstown Visitor Centre 복귀 — 공식 상품 일정 기준
- 19:30은 예약확인서 본문이 아니라 Southern Discoveries 공식 Coach & Nature Cruise 시간표의 Queenstown return time이다.
- 교통량, Milford Road 경관 정차 및 당일 운영상황에 따라 복귀 시간은 변동될 수 있다.
- 복귀 후 숙소 이동은 별도 일정으로 둔다.

Drive 문서:

`03_Tours/20270121_MILFORD_SOUTHERN_DISCOVERIES_BOOKING.pdf`

웹앱 TOUR 카드:

- 픽업 06:45 · Hampshire Holiday Parks Queenstown Lakeview
- 코치 출발 07:00 · Southern Discoveries Queenstown Visitor Centre
- 복귀 19:30 예정 · Southern Discoveries Queenstown Visitor Centre
- `픽업 위치 / 복귀 위치 / Milford 위치 / 예약 확약서` 액션을 한 줄로 표시

Milford 결제 완료 여부/최종 결제금액은 예약확인서만으로 확정하지 않는다.

---

## 5. 날짜별 일정 요약

- 1/16: 인천공항 인근 전날 숙박 예정(미예약). 숙소 선정·T2 이동수단 확인 필요.
- 1/17 (일): 04:20 인천공항 인근 숙소 출발(잠정) → 05:00 T2 도착, 05:10 수속, 06:00 라운지, 07:20 탑승 준비(사용자 고정) → 08:00 ICN 출발 → 20:05 SYD 도착 → 21:15 택시 이동(예상) → 22:00 Meriton 체크인(사용자 고정 시각)
- 1/18 Sydney CBD / Fish Market / Barangaroo / The Rocks / Observatory
- 1/19 Surry Hills / Bondi / Botanic Garden / Opera House
- 1/20 Sydney → Queenstown
- 1/21 **06:35 리셉션 대기 → 06:45 숙소 픽업 → 07:00 Visitor Centre 코치 출발 → Milford Sound Nature Cruise → 19:30 Visitor Centre 복귀 예정 → 숙소 이동**
- 1/22 Queenstown 휴식 + **15:00 Hertz 렌터카 수령**
- 1/23 Onsen → Arrowtown → Crown Range / Cardrona → Wanaka
- 1/24 Wanaka → Pukaki → Tekapo → Fairlie
- 1/25 Fairlie → Geraldine → Christchurch + **15:00 Hertz 렌터카 반납**
- 1/26 Christchurch → Auckland
- 1/27 Rotorua Day Tour
- 1/28 Waiheke Island
- 1/29 Auckland → Incheon

세부 일정의 기준은 `itinerary.js`다.

### 일정 분류 체계 (검토용 · 2026-10-27)

- `days[].items[].planStatus`: `fixed`(고정), `planned`(계획), `candidate`(후보) 중 하나로 **모든 타임라인 항목**을 분류한다.
- **고정:** 항공 이착륙, 확정 투어 픽업/시작, 온센, Hertz 수령·반납 등 예약 또는 운영 시간에 구속되는 일정. 변경 시 예약 확인이 필요하다.
- **계획:** 이동 방향·행선지는 정했지만 시각은 조정 가능한 일정. 예약 완료 숙소의 **체크인 예상 시각**도 여기에 속하며, 숙소 자체가 미예약이라는 뜻은 아니다.
- **후보:** 아직 동선·식당·방문 여부를 검토할 수 있는 임시 일정. 표기된 시간은 예약 시간이 아니다.
- **예약/결제 상태는 `booking-data.js` 및 Google Budget에서 별도 관리**한다. `planStatus`만으로 예약 여부를 판단하지 않는다.
- 로토루아 1/27은 계획(상품 미예약)이며 기존 `fixed: true`를 해제한다. 와이헤케 1/28은 후보이다.
- 분류는 기존 초안에 대한 1차 라벨링으로, **장소·순서·시간 자체를 새로 확정한 것은 아니다.**
- Google Schedule은 보조표이므로 상세 일정 최종 승인 후 동기화한다.
- **V41 전체 일정 탭:** 일정 메뉴의 `하루 일정 | 전체 일정` 스위치로 전환한다. 전체 표는 `itinerary.js`를 직접 읽어 날짜(가로) × 시간(세로)의 13일 시간표를 생성한다. 구간(전체·시드니·남섬·오클랜드)과 고정·계획·후보 필터, 표에서 날짜별 상세 일정으로 이동하는 기능을 제공한다. 모바일은 가로·세로 스크롤/시간열·날짜행 고정으로 표시한다. 시각이 정해지지 않은 항목은 기타 행에 표시한다.
- Google Schedule 시트에 남아 있는 일부 관광지/식당은 웹앱 최신 초안과 불일치할 수 있으므로 **웹앱 시간표로 직접 복사하지 않는다**.
- **1/17 출국일(일요일) 확정(사용자 요청):** 05:00 T2 도착 / 05:10 대한항공 비즈니스 수속 / 06:00 프레스티지 라운지 / 07:20 탑승구 이동 / 22:00 시드니 Meriton 체크인. 여기서 '고정'은 여행자 기준 계획 고정이며, 체크인 22:00는 숙소의 계약상 시간 보증과 다르다.
- **1/16 인천공항 인근 숙소 1박 계획(미예약):** 기존 1/17 03:15 용인 출발은 폐기하고, 1/17 04:20 숙소→T2 이동을 잠정 배치(숙소 위치·셔틀/택시 확정 시 재조정). 용인 자택 상세주소·좌표는 공개 웹앱의 `itinerary.js`와 `app.js`에서 제거.
- **1/17 시드니 T1→Meriton 이동(계획):** 21:15 공항 공식 택시승강장에서 택시 권장(2인·캐리어, 현지 공항의 시내 택시 요금 참고 AUD 45~55 + 별도 할증 가능). 대안 T8 Airport Link → Central역 → 숙소 도보 약 6분. 입국심사·수하물 수령 시각에 따라 출발/실제 체크인 지연 가능.

### Google Schedule Sheet

- 파일: **Honeymoon Schedule 2027**
- Spreadsheet ID: `1sNmM1HXMUhMctdZoIdkswjvXpug7-hBR7R-MRiSgvro`
- 시트: `시트1`

1/21 열 최신 반영:

- 05시: 기상 · 투어 준비
- 06시: `06:35 Hampshire Holiday Parks Queenstown 리셉션 대기 / 06:45 숙소 픽업 → Southern Discoveries Queenstown Visitor Centre`
- 07시: `07:00 Southern Discoveries Queenstown Visitor Centre 출발 / 110 Beach Street → Milford Road / Nature Cruise + To Kai Lunch`
- 19시: `19:30 Southern Discoveries Queenstown Visitor Centre 복귀 예정 / 이후 숙소 이동`
- 기존 20:00 확정 복귀 문구는 삭제

---

## 6. Hertz 렌터카 — 확정 예약

- 업체: **Hertz**
- Queenstown Downtown → Christchurch Downtown 편도
- 수령: **2027-01-22 15:00**
- 반납: **2027-01-25 15:00**
- 차량: **Compact SUV (Group G0 / CFAR)** · Kia Seltos 또는 동급
- 무제한 km
- 예약 문서상 차량손실 면책 프로그램 포함
- 예상 총 임차비용: **NZD 560.21**
- 결제: **후지불 / 현지 카운터 결제**
- 기본요금 NZD 487.14 + 세금 NZD 73.07
- 보증금 / 추가 카드 pre-authorisation / 카드 surcharge / 연료·통행료·현지 추가옵션은 별도 가능

기존 NZD 746.93 견적, 17:00 반납, `Full Coverage / Zero Excess` 표현은 폐기한다.

Drive:

`04_Rental/20270122-20270125_ZQN-CHC_HERTZ_BOOKING.pdf`

현재 렌터카 문서: **1 / 1 연결**

`itinerary.js` 예산 항목에서도 `Full Coverage` 문구를 제거하고 `예약금액 + 연료/부대비용`으로 표현한다.

---

## 7. Google Drive Private Docs

루트: `honeymoon270117`

```text
honeymoon270117
├─ 01_Flights
├─ 02_Stays
├─ 03_Tours
├─ 04_Rental
└─ Honeymoon Budget 2027
```

운영 원칙:

- 일반 액세스 `Restricted`
- 본인 + 배우자 계정만 접근 허용
- Public GitHub에는 PDF 원본 저장 금지
- 여행 전 핵심 문서는 Drive 앱 오프라인 사용 설정 권장

파일명 규칙:

- 항공 승객별 티켓: `YYYYMMDD_ORIGIN-DEST_PASSENGER_AIRLINECODE.pdf`
- 항공 공용 문서: `YYYYMMDD_ORIGIN-DEST_ITINERARY_EN.pdf` 또는 `..._ETICKET_KO-EN.pdf`
- 숙박: `YYYYMMDD-YYYYMMDD_LOCATION_PROPERTY_VOUCHER_KO/EN.pdf`, `..._RECEIPT.pdf`
- 투어: `YYYYMMDD_ACTIVITY_OPERATOR_BOOKING.pdf`
- 렌터카: `YYYYMMDD-YYYYMMDD_ORIGIN-DEST_HERTZ_BOOKING.pdf`

---

## 8. 예약 탭 / 현지 결제 UI — V36

상단 필터: `FLIGHTS / STAYS / TOURS / CAR`

### 카드 레이아웃

- CAR를 선택하면 렌터카 카드가 다른 탭과 동일하게 필터/현지결제 영역 바로 아래로 올라온다.
- 카드 상단: 날짜/구간 + 예약명
- **현지에서 실제 결제가 필요한 항목만** 오른쪽에 작은 `현지결제 필요 · 금액` 배지를 표시한다.
- `결제 완료` 배지는 일반 예약에는 표시하지 않는다. **단 Onsen Hot Pools(1/23) 카드에는 사용자 확인 기준 `결제 완료 · NZD 180` 배지를 표시한다.**
- 결제 미확정 투어도 카드에 긴 결제 설명을 표시하지 않는다.
- 위치 / 예약서 / 티켓 등 액션은 카드 아래에서 한 줄 가로 정렬한다.
- 화면 폭이 좁으면 액션 행만 가로 스크롤한다.
- 단, FLIGHTS에서 상훈/진영 **개별 승객 티켓은 가로 스크롤 대신 위아래 세로 배치**한다.

현재 카드에 표시되는 현지결제 배지:

- Meriton Suites Campbell Street: **현지결제 필요 · AUD 795**
- Hertz: **현지결제 필요 · NZD 560.21**

Fairlie Airbnb는 ₩391,259 선결제 완료이므로 현지결제 배지를 표시하지 않는다.

### V32/V33 관련 파일

- `reservation-data-v32.js`: Milford 픽업/출발/복귀 데이터 보강
- `schedule-map-v32.js`: 1/21 지도 위치 보정
- `booking-layout-v32.js`: CAR 위치 / 현지결제 배지 / Milford 카드 액션 정리
- `booking-layout-v32.css`: 카드 및 액션 한 줄 레이아웃
- `reservation-data-v33.js`: Fairlie Airbnb 문서 + 선결제 완료 상태 반영
- `flight-wallet.css`: 항공 개별 승객 티켓 세로 배치


### V36 일정 운용 UI

- 홈 `NOW / NEXT` 계산에서는 `HH:MM` 형식의 일정만 사용한다. `투어 중`, `이후` 같은 표시용 문구는 시간 계산에서 제외한다.
- 예약 탭을 확인한 뒤 일정 탭으로 돌아와도 사용자가 마지막으로 선택한 날짜를 유지한다. `오늘 / 다음` 버튼은 기존처럼 기준 날짜로 이동한다.
- 항공 이동일에는 일정 상단에 국제선/국내선, 공항 이동, 출발·도착 현지시간, 출발 공항 길찾기와 티켓을 한 카드로 표시한다.
- 터미널·체크인 카운터·탑승구는 변동 가능하므로 출발 당일 항공권과 항공사 앱에서 최종 확인하도록 표시한다.
- 일정 항목에서 연결된 항공권, 숙소 영문 예약서, 투어 예약서, 렌터카 예약서를 바로 열 수 있다.
- Rotorua, Waiheke처럼 문서가 아직 연결되지 않은 일정에는 `예약정보 확인 필요`를 표시한다. Onsen 예약확인서는 연결되어 있다.
- `itinerary.js`의 `bookingKey`가 일정과 `booking-data.js` 예약 데이터를 연결한다.
- `trip-operations-v36.js` / `trip-operations-v36.css`: 항공 이동 카드와 일정별 예약 문서 액션을 담당한다.

### V38 입국 신고 작성 가이드

- 더보기 탭에 `입국` 필터를 추가한다.
- `entry-guide-v37.js` / `entry-guide-v37.css`: 호주 Incoming Passenger Card(IPC)와 New Zealand Traveller Declaration(NZTD) 작성 가이드를 담당한다.
- 공개 사이트에는 여권번호, 생년월일, Gmail, 개인 전화번호, 긴급연락처 등 개인정보를 저장하지 않는다.
- 입국 가이드에는 영문 필드명 + 한글 뜻 + 우리 일정 기준 입력 예시를 함께 표시한다.
- Gmail/전화번호는 공개 코드에 넣지 않고 브라우저 localStorage에만 저장할 수 있는 개인 연락처 메모를 제공한다.
- 여행 일정에서 안전하게 공개 가능한 값만 미리 보여준다.
  - 호주 IPC: KE401, Meriton Suites Campbell Street 주소, NSW, 호주 체류 3일, Holiday
  - NZTD: NZ234, Sydney 출발, Queenstown 첫 숙소 주소, 뉴질랜드 체류 9일, Holiday/Vacation
- 호주 IPC는 1/17 KE401 기내에서 작성하도록 일정에 안내를 추가한다.
- NZTD는 시드니 체류 후 출발하는 일정이므로 1/20 10:55 NZ234 출발 기준 24시간 전인 **1/19 10:55 AEDT 이후** 제출 가능하며, 일정에는 11:00 작성 알림을 둔다.
- 두 사람은 NZTD를 각각 제출한다.
- 신고 물품 YES/NO는 사이트에서 미리 확정하지 않고 실제 수하물·최근 방문 이력을 기준으로 답하도록 안내한다.
- 공식 ABF / NZTD / Immigration New Zealand 링크를 가이드에서 바로 열 수 있다.
- 질문과 허용량은 2026-09-22 공식 기준이며 2027-01 출발 직전에 다시 확인한다.

---

## 9. 더보기 탭 / 문서 현황

현재 문서 연결 기준:

- 항공: **6 / 6**
- 숙박: **15 / 15**
- 투어: **2 / 4**
- 렌터카: **1 / 1**
- 전체: **24 / 26**

---

## 10. 예산 관리

전체 여행 예산 canonical source는 Google Sheet **Honeymoon Budget 2027**이다.

- 운영 목표: ₩18,500,000
- 여유 상한: ₩20,000,000
- 확정 항공+숙박: ₩12,151,155

역할 분리:

- Google Sheet: 전체 여행 예산 / 실제 지출
- 웹앱 예약 탭: 앞으로 현지에서 결제해야 할 AUD/NZD 금액

---

## 11. PWA / Offline

- `manifest.webmanifest` + `service-worker.js`
- 현재 cache version: **`honeymoon-v42`** (1/17 출국·공항 이동 계획)
- `index.html`의 `itinerary.js`와 `app.js`는 **V42**로 갱신. 전체 일정표 JS/CSS는 V41 유지, 기존 `styles.css`는 V40, 온센 결제 관련 파일은 V39 유지
- `reservation-data-v33.js`도 APP_SHELL에 포함
- `trip-operations-v36.js` / `trip-operations-v36.css`도 APP_SHELL에 포함
- `entry-guide-v37.js` / `entry-guide-v37.css`도 APP_SHELL에 포함
- 지도 / Google Maps / Google Drive / 외부 예약 앱은 인터넷 필요

---

## 12. 보안 원칙

Public repository / GitHub Pages에는 직접 저장하지 않는다:

- 여권번호 / 생년월일 등 신원정보
- 항공/호텔/투어/렌터카 예약번호
- Airbnb 확인 코드
- QR / 바코드 / 탑승권 이미지
- 예약확인서 PDF 원본
- 카드번호 / 실제 카드 식별정보
- 개인 전화번호 / 이메일
- 보험증권 번호

Drive 링크가 Public JS에 있어도 실제 파일 접근은 Google Drive `Restricted` 권한으로 제어한다.

---

## 13. 현재 TODO

- [x] Fairlie Airbnb 예약 인원 2명 변경 완료(사용자 확인)
- [ ] Fairlie Airbnb 최신 2명 예약확인서 확보·Drive 문서 교체(현재 파일은 1명 표기)
- [ ] Milford Sound 결제 완료 여부/최종 결제금액 확인
- [ ] 여행 직전 Southern Discoveries 06:45 숙소 픽업 및 07:00/19:30 공식 시간표 재확인
- [ ] Southern Discoveries Multi-Language Commentary 앱 및 이어폰 준비
- [ ] Hertz 보증금 / pre-authorisation 실제 승인 금액 확인
- [ ] Hertz 추가 운전자 필요 여부 / 카드 surcharge 적용 여부 확인
- [x] Onsen 예약 정보/문서/결제정보 반영 — 2027-01-23 · NZD 180 · 사용자 결제완료 확인
- [ ] Rotorua 상품/결제정보 확정
- [ ] Waiheke 방식 확정
- [ ] AUD / NZD 현금이 실제 필요한 항목 확인
- [ ] 주요 저녁 식당 확정
- [ ] 가족 선물 수량/예산 확정
- [ ] ETA / NZeTA / IVL 준비
- [ ] 여행자보험 / eSIM 준비
- [ ] Drive를 본인/배우자 계정만 접근하도록 최종 검증
- [ ] 핵심 Drive 문서 오프라인 저장
- [ ] 실제 Android/iPhone에서 V36 항공 이동 카드 / 일정 예약 링크 / 예약 카드 / PWA 갱신 확인
- [ ] 여행 직전 대한항공 T2/라운지 운영시간 재확인
- [ ] 1/16 인천공항 인근 숙소 1박 예약(현 상태 미예약) 및 T2까지 셔틀/택시 이동수단·첫차 운영시간 확인
- [ ] 1/17 시드니 공항 택시 실제 요금·승차 위치 여행 직전 확인

---

## 14. 핵심 원칙

**숙소·항공과 핵심 경험은 유지하면서 이동 피로를 줄이고, 여행 중 휴대폰에서 일정·예약·문서·현지 결제·긴급정보를 빠르게 확인할 수 있게 운영한다. 일정은 `itinerary.js`, 상세 일정 보조표는 `Honeymoon Schedule 2027`, 전체 예산은 `Honeymoon Budget 2027`, 예약 기본 데이터는 `booking-data.js`, 최신 예약 보강은 버전별 데이터 파일, 민감 예약 문서는 Restricted Google Drive를 기준으로 사용한다.**
