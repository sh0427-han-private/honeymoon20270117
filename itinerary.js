// planStatus: fixed = 예약/운영 시각 고정, planned = 큰 방향 유지·시간 조정 가능, candidate = 검토 중.
// 예약·결제 완료 여부는 별도 booking-data.js에서 관리한다.
const tripData = {
    cities: [
        "Sydney",
        "Queenstown",
        "Wanaka",
        "Fairlie",
        "Christchurch",
        "Auckland"
    ],
    days: [
        {
            date: "2027-01-17",
            label: "1/17 (일)",
            city: "Sydney",
            title: "인천공항 인근 숙소 → 인천공항 → 시드니",
            intensity: 2,
            items: [
                {
                    time: "03:20",
                    title: "기상 · 출국 준비 및 숙소 체크아웃",
                    type: "note", planStatus: "fixed",
                    note: "04:20 공항 이동에 맞춰 1시간 전 기상(사용자 확정). 1/16 인천공항 근처 숙소는 아직 미예약. 셀토스 T2 예약주차장 1/16~1/29 이용 결정(예약은 미완료)"
                },
                {
                    time: "04:20",
                    title: "인천공항 인근 숙소 출발 · 제2여객터미널 이동",
                    type: "transport", planStatus: "planned",
                    note: "1/16 셀토스 T2 예약주차장 장기주차 예정(미예약). 다락휴 T2 20:00 Overnight 1박을 검토 중(미예약). 05:00 T2 도착 목표, 다락휴 예약 시 T2 내부 도보 이동으로 조정"
                },
                {
                    time: "05:00",
                    title: "인천국제공항 제2여객터미널 도착",
                    type: "transport", planStatus: "fixed",
                    note: "08:00 국제선 출발 3시간 전 도착 목표"
                },
                {
                    time: "05:10",
                    title: "대한항공 비즈니스 체크인 · 수하물 위탁",
                    type: "flight", planStatus: "fixed",
                    note: "체크인 후 보안검색·출국심사 진행"
                },
                {
                    time: "06:00",
                    title: "대한항공 프레스티지 라운지 · 아침식사 & 휴식",
                    type: "lounge", planStatus: "fixed",
                    note: "T2 프레스티지 서편 라운지 기준 · 현재 04:00부터 운영, 약 1시간 이상 여유롭게 이용"
                },
                {
                    time: "07:20",
                    title: "탑승구 이동 · 탑승 준비",
                    type: "note", planStatus: "fixed"
                },
                {
                    time: "08:00",
                    title: "인천 출발",
                    type: "flight", planStatus: "fixed",
                    bookingKey: "icn-syd",
                    note: "대한항공 비즈니스"
                },
                {
                    time: "기내",
                    title: "호주 Incoming Passenger Card 작성",
                    type: "note", planStatus: "planned",
                    note: "KE401 기내 배포 시 영어로 작성 · 더보기 > 입국 가이드의 IPC 항목 참고"
                },
                {
                    time: "20:05",
                    title: "시드니 도착",
                    type: "flight", planStatus: "fixed",
                    note: "시드니 T1 국제선 도착 · 입국심사 및 수하물 수령 후 Uber·DiDi 앱에서 호출하고 해당 서비스의 지정 픽업 구역으로 이동(실제 소요시간에 따라 후속 일정 조정)"
                },
                {
                    time: "21:15",
                    title: "Uber·DiDi 앱 호출 차량으로 Meriton Suites 이동",
                    type: "transport", planStatus: "planned",
                    note: "입국심사·수하물 수령 후 Uber와 DiDi 앱에서 'Meriton Suites Campbell Street' 목적지 및 실시간 요금 비교 → 차량 호출. [UberX] T1 Arrivals Hall B 바깥 Rank C(출구 약 20m), 앱의 6자리 PIN을 기사에게 알려주고 탑승(현재 PIN 운영 06:00~22:00). [Uber XL·Premium 등] Rank B의 지정 베이. [DiDi] 초록색 Rideshare 표지를 따라 Priority Pick-up Zone으로 이동하고 앱의 탑승 위치·차량번호 확인. 일반 택시 Taxi Rank와 앱 픽업 구역은 별도. 앱 호출이 어려우면 일반 택시 승강장 이용. 앱 요금은 호출 시점의 표시 금액 기준이며, 21:15는 예상 시각. 현장 표지·앱 안내를 우선 확인",
                    guideUrl: "https://www.sydneyairport.com.au/info-sheet/by-taxi-and-rideshare",
                    guideLabel: "시드니 공항 공식 픽업 안내"
                },
                {
                    time: "22:00",
                    title: "메리톤 스위트 캠벨 스트리트 체크인",
                    type: "hotel", planStatus: "fixed",
                    bookingKey: "sydney-meriton",
                    note: "사용자 확정 체크인 목표 22:00 · 숙소 예약은 완료. 항공 지연·입국심사·공항 교통상황에 따라 실제 도착시간은 변동 가능"
                }
            ]
        },
        {
            date: "2027-01-18",
            label: "1/18 (월)",
            city: "Sydney",
            title: "시드니 도심 & 하버",
            intensity: 3,
            items: [
                { time: "09:00", title: "브런치", type: "meal", planStatus: "candidate" },
                { time: "10:00", title: "Queen Victoria Building", type: "sightseeing", planStatus: "candidate" },
                { time: "12:00", title: "Sydney Fish Market 점심", type: "meal", planStatus: "candidate" },
                { time: "14:00", title: "Barangaroo · Darling Harbour 산책", type: "sightseeing", planStatus: "candidate" },
                { time: "16:30", title: "The Rocks", type: "sightseeing", planStatus: "candidate" },
                { time: "19:30", title: "Sydney Observatory 일몰", type: "sightseeing", planStatus: "candidate" }
            ]
        },
        {
            date: "2027-01-19",
            label: "1/19 (화)",
            city: "Sydney",
            title: "본다이 & 오페라하우스",
            intensity: 3,
            items: [
                { time: "10:00", title: "Surry Hills 산책 & 브런치", type: "meal", planStatus: "candidate" },
                { time: "11:00", title: "NZ Traveller Declaration 제출", type: "note", planStatus: "planned", note: "1/20 10:55 NZ234 출발 24시간 전부터 제출 가능 · 두 사람 각각 작성 · 더보기 > 입국 가이드 참고" },
                { time: "12:00", title: "Bondi Beach", type: "sightseeing", planStatus: "candidate" },
                { time: "15:30", title: "호텔 복귀 · 샤워 · 휴식", type: "hotel", planStatus: "candidate" },
                { time: "17:00", title: "Royal Botanic Garden", type: "sightseeing", planStatus: "candidate" },
                { time: "18:30", title: "Sydney Opera House · Circular Quay", type: "sightseeing", planStatus: "candidate" },
                { time: "19:30", title: "로맨틱 디너 & 와인", type: "meal", planStatus: "candidate" }
            ]
        },
        {
            date: "2027-01-20",
            label: "1/20 (수)",
            city: "Queenstown",
            title: "시드니 → 퀸스타운",
            intensity: 1,
            items: [
                { time: "07:30", title: "호텔 출발 · 시드니 공항 이동", type: "transport", planStatus: "planned" },
                { time: "10:55", title: "시드니 출발", type: "flight", planStatus: "fixed", bookingKey: "syd-zqn" },
                { time: "16:00", title: "퀸스타운 도착", type: "flight", planStatus: "fixed" },
                { time: "18:00", title: "숙소 체크인 & Lake Wakatipu 산책", type: "hotel", planStatus: "planned", bookingKey: "queenstown-lakeview" }
            ]
        },
        {
            date: "2027-01-21",
            label: "1/21 (목)",
            city: "Queenstown",
            title: "밀포드사운드 투어",
            intensity: 5,
            fixed: true,
            items: [
                {
                    time: "05:00",
                    title: "기상 · 투어 준비",
                    type: "note", planStatus: "planned",
                    note: "준비물: 따뜻한 방수 재킷 · 미끄럼 방지 신발 · 선크림 · 벌레기피제 · 이어폰"
                },
                {
                    time: "06:35",
                    title: "Hampshire Holiday Parks Queenstown Lakeview 리셉션 대기",
                    type: "note", planStatus: "fixed",
                    note: "예약확인서 기준 픽업 10분 전까지 리셉션 대기"
                },
                {
                    time: "06:45",
                    title: "Hampshire Holiday Parks Queenstown Lakeview 픽업",
                    type: "tour", planStatus: "fixed",
                    bookingKey: "milford",
                    fixed: true,
                    note: "택시 픽업 → Southern Discoveries Queenstown Visitor Centre · St Omer Wharf, 110 Beach Street"
                },
                {
                    time: "07:00",
                    title: "Southern Discoveries Queenstown Visitor Centre 코치 출발",
                    type: "transport", planStatus: "fixed",
                    fixed: true,
                    note: "공식 Coach & Nature Cruise 상품 일정 기준 · Milford Road 경관 정차는 교통/운영상황에 따라 변동"
                },
                {
                    time: "투어 중",
                    title: "Milford Sound Nature Cruise · To Kai Lunch",
                    type: "tour", planStatus: "fixed",
                    fixed: true,
                    note: "Nature Cruise + To Kai Lunch 2인 포함 · 한국어 코멘터리 앱 사용 가능(이어폰 필요)"
                },
                {
                    time: "19:30",
                    title: "Southern Discoveries Queenstown Visitor Centre 복귀 예정",
                    type: "transport", planStatus: "planned",
                    note: "공식 상품 일정 기준 Queenstown 19:30 복귀 · 교통 및 경관 정차 상황에 따라 변동 가능"
                },
                {
                    time: "이후",
                    title: "숙소 이동 · 휴식",
                    type: "hotel", planStatus: "planned"
                }
            ]
        },
        {
            date: "2027-01-22",
            label: "1/22 (금)",
            city: "Queenstown",
            title: "퀸스타운 휴식 & 렌터카 수령",
            intensity: 2,
            items: [
                { time: "09:30", title: "늦은 기상 & 브런치", type: "meal", planStatus: "candidate" },
                { time: "11:30", title: "Skyline Gondola 또는 Queenstown Gardens", type: "sightseeing", planStatus: "candidate" },
                { time: "15:00", title: "렌터카 수령", type: "car", planStatus: "fixed", bookingKey: "queenstown-christchurch", note: "Hertz Queenstown Downtown · Compact SUV (G0) · Kia Seltos 또는 동급 · 차량손실 면책 프로그램 포함" },
                { time: "18:00", title: "Queenstown 저녁 · 와인", type: "meal", planStatus: "candidate" }
            ]
        },
        {
            date: "2027-01-23",
            label: "1/23 (토)",
            city: "Wanaka",
            title: "온센 → 애로우타운 → 와나카",
            intensity: 3,
            items: [
                { time: "08:45", title: "Onsen Hot Pools 도착", type: "tour", planStatus: "fixed", fixed: true },
                { time: "09:00", title: "Onsen Hot Pools", type: "tour", planStatus: "fixed", bookingKey: "onsen", fixed: true },
                { time: "10:30", title: "Arrowtown 산책 & 점심", type: "sightseeing", planStatus: "candidate" },
                { time: "12:30", title: "Crown Range · Cardrona 경유", type: "drive", planStatus: "planned" },
                { time: "15:00", title: "Edgewater Wanaka 체크인", type: "hotel", planStatus: "planned", bookingKey: "wanaka-edgewater" },
                { time: "17:00", title: "Lake Wanaka · That Wanaka Tree 산책", type: "sightseeing", planStatus: "candidate" }
            ]
        },
        {
            date: "2027-01-24",
            label: "1/24 (일)",
            city: "Fairlie",
            title: "와나카 → 푸카키 → 테카포 → 페얼리",
            intensity: 3,
            items: [
                { time: "09:30", title: "Wanaka 출발", type: "drive", planStatus: "planned" },
                { time: "12:00", title: "Lake Pukaki · 연어 점심", type: "meal", planStatus: "candidate" },
                { time: "15:00", title: "Lake Tekapo 도착", type: "sightseeing", planStatus: "planned" },
                { time: "15:30", title: "Church of the Good Shepherd · 호수 산책", type: "sightseeing", planStatus: "candidate" },
                { time: "19:00", title: "Fairlie 숙소 이동 & 체크인", type: "hotel", planStatus: "planned", bookingKey: "fairlie-airbnb" }
            ]
        },
        {
            date: "2027-01-25",
            label: "1/25 (월)",
            city: "Christchurch",
            title: "페얼리 → 크라이스트처치",
            intensity: 2,
            items: [
                { time: "09:30", title: "Fairlie 출발", type: "drive", planStatus: "planned" },
                { time: "10:30", title: "Geraldine 카페", type: "meal", planStatus: "candidate" },
                { time: "13:30", title: "Christchurch 도착 · 호텔 짐 보관", type: "hotel", planStatus: "planned", bookingKey: "christchurch-breakfree" },
                { time: "15:00", title: "Hertz Christchurch Downtown 렌터카 반납", type: "car", planStatus: "fixed", bookingKey: "queenstown-christchurch", note: "Unit 4, 150 Kilmore St · 영업시간 14:00-17:00" },
                { time: "15:30", title: "Riverside Market · Cathedral Square · New Regent Street", type: "sightseeing", planStatus: "candidate" }
            ]
        },
        {
            date: "2027-01-26",
            label: "1/26 (화)",
            city: "Auckland",
            title: "크라이스트처치 → 오클랜드",
            intensity: 1,
            items: [
                { time: "09:30", title: "택시로 Christchurch Airport 이동", type: "transport", planStatus: "planned" },
                { time: "12:00", title: "크라이스트처치 출발", type: "flight", planStatus: "fixed", bookingKey: "chc-akl" },
                { time: "13:25", title: "오클랜드 도착", type: "flight", planStatus: "fixed" },
                { time: "15:00", title: "Hilton Auckland 체크인", type: "hotel", planStatus: "planned", bookingKey: "auckland-hilton" },
                { time: "17:00", title: "Commercial Bay 가족 선물 쇼핑", type: "shopping", planStatus: "candidate" },
                { time: "19:00", title: "Viaduct Harbour 저녁", type: "meal", planStatus: "candidate" }
            ]
        },
        {
            date: "2027-01-27",
            label: "1/27 (수)",
            city: "Auckland",
            title: "로토루아 투어",
            intensity: 5,
            items: [
                { time: "07:00", title: "Rotorua 당일 투어 출발", type: "tour", planStatus: "planned", bookingKey: "rotorua", note: "투어 상품·픽업 장소·출발 시각 미확정(07:00 임시 배치)" },
                { time: "20:00", title: "Auckland 복귀 · 호텔 휴식", type: "hotel", planStatus: "planned" }
            ]
        },
        {
            date: "2027-01-28",
            label: "1/28 (목)",
            city: "Auckland",
            title: "Waiheke Island",
            intensity: 3,
            items: [
                { time: "09:30", title: "Downtown Ferry Terminal", type: "transport", planStatus: "candidate" },
                { time: "10:30", title: "Waiheke Island · 와이너리 & 점심", type: "tour", planStatus: "candidate", bookingKey: "waiheke" },
                { time: "17:30", title: "Auckland 복귀", type: "transport", planStatus: "candidate" },
                { time: "19:00", title: "여행 마지막 저녁", type: "meal", planStatus: "candidate" }
            ]
        },
        {
            date: "2027-01-29",
            label: "1/29 (금)",
            city: "Auckland",
            title: "귀국",
            intensity: 1,
            items: [
                { time: "08:00", title: "Hilton Auckland 출발 · 공항 이동", type: "transport", planStatus: "planned" },
                { time: "11:45", title: "오클랜드 출발", type: "flight", planStatus: "fixed", bookingKey: "akl-icn" },
                { time: "19:40", title: "인천 도착", type: "flight", planStatus: "fixed" }
            ]
        }
    ],
    flights: [
        { route: "인천 → 시드니", date: "1/17", time: "08:00 → 20:05", airline: "대한항공 · 비즈니스", price: 4994400 },
        { route: "시드니 → 퀸스타운", date: "1/20", time: "10:55 → 16:00", airline: "Air New Zealand", price: 918400 },
        { route: "크라이스트처치 → 오클랜드", date: "1/26", time: "12:00 → 13:25", airline: "Air New Zealand", price: 246000 },
        { route: "오클랜드 → 인천", date: "1/29", time: "11:45 → 19:40", airline: "대한항공", price: 2003800 }
    ],
    flightOperations: [
        {
            date: "2027-01-17",
            bookingKey: "icn-syd",
            category: "국제선",
            countries: "대한민국 → 호주",
            route: "ICN → SYD",
            airportTransfer: "03:15 · 용인 출발",
            airportTarget: "05:00 · 인천공항 T2 도착 목표",
            departure: "08:00 KST",
            departurePlace: "ICN · 제2여객터미널",
            arrival: "20:05 AEDT",
            arrivalPlace: "SYD · 시드니",
            mapQuery: "Incheon International Airport Terminal 2"
        },
        {
            date: "2027-01-20",
            bookingKey: "syd-zqn",
            category: "국제선",
            countries: "호주 → 뉴질랜드",
            route: "SYD → ZQN",
            airportTransfer: "07:30 · 호텔 출발",
            airportTarget: "출발 터미널 · 당일 확인",
            departure: "10:55 AEDT",
            departurePlace: "SYD · 국제선",
            arrival: "16:00 NZDT",
            arrivalPlace: "ZQN · 퀸스타운",
            mapQuery: "Sydney Airport International Terminal"
        },
        {
            date: "2027-01-26",
            bookingKey: "chc-akl",
            category: "국내선",
            countries: "뉴질랜드 국내 이동",
            route: "CHC → AKL",
            airportTransfer: "09:30 · 호텔에서 택시 출발",
            airportTarget: "출발 구역 · 당일 확인",
            departure: "12:00 NZDT",
            departurePlace: "CHC · 국내선",
            arrival: "13:25 NZDT",
            arrivalPlace: "AKL · 국내선",
            mapQuery: "Christchurch Airport Domestic Terminal"
        },
        {
            date: "2027-01-29",
            bookingKey: "akl-icn",
            category: "국제선",
            countries: "뉴질랜드 → 대한민국",
            route: "AKL → ICN",
            airportTransfer: "08:00 · 호텔 출발",
            airportTarget: "출발 터미널 · 당일 확인",
            departure: "11:45 NZDT",
            departurePlace: "AKL · 국제선",
            arrival: "19:40 KST",
            arrivalPlace: "ICN · 인천",
            mapQuery: "Auckland Airport International Terminal"
        }
    ],
    hotels: [
        { city: "Sydney", dates: "1/17 → 1/20", name: "Meriton Suites Campbell Street", price: 811000 },
        { city: "Queenstown", dates: "1/20 → 1/23", name: "Hampshire Holiday Parks Queenstown Lakeview", price: 734799 },
        { city: "Wanaka", dates: "1/23 → 1/24", name: "Edgewater Hotel", price: 483929 },
        { city: "Fairlie", dates: "1/24 → 1/25", name: "Fairlie Airbnb", price: 391259 },
        { city: "Christchurch", dates: "1/25 → 1/26", name: "BreakFree on Cashel Christchurch", price: 105905 },
        { city: "Auckland", dates: "1/26 → 1/29", name: "Hilton Auckland", price: 1461663 }
    ],
    places: [
        { name: "인천국제공항 제2여객터미널", city: "Incheon", lat: 37.4692, lng: 126.4335, category: "공항" },
        { name: "대한항공 프레스티지 라운지(서편)", city: "Incheon Airport T2", lat: 37.4692, lng: 126.4335, category: "라운지" },
        { name: "Meriton Suites Campbell Street", city: "Sydney", lat: -33.8797, lng: 151.2056, category: "숙소" },
        { name: "Queen Victoria Building", city: "Sydney", lat: -33.8718, lng: 151.2067, category: "관광" },
        { name: "Sydney Fish Market", city: "Sydney", lat: -33.8732, lng: 151.1923, category: "식사" },
        { name: "Bondi Beach", city: "Sydney", lat: -33.8915, lng: 151.2767, category: "관광" },
        { name: "Sydney Opera House", city: "Sydney", lat: -33.8568, lng: 151.2153, category: "관광" },
        { name: "Queenstown Lakeview", city: "Queenstown", lat: -45.0274, lng: 168.6602, category: "숙소" },
        { name: "Southern Discoveries Queenstown Visitor Centre", city: "Queenstown", lat: -45.034225, lng: 168.656356, category: "투어" },
        { name: "Onsen Hot Pools", city: "Queenstown", lat: -44.9876, lng: 168.6795, category: "투어" },
        { name: "Arrowtown", city: "Queenstown", lat: -44.9383, lng: 168.8358, category: "관광" },
        { name: "Edgewater Wanaka", city: "Wanaka", lat: -44.6985, lng: 169.1128, category: "숙소" },
        { name: "That Wanaka Tree", city: "Wanaka", lat: -44.6981, lng: 169.1170, category: "관광" },
        { name: "Lake Pukaki", city: "Fairlie", lat: -44.1720, lng: 170.1314, category: "관광" },
        { name: "Lake Tekapo", city: "Fairlie", lat: -44.0047, lng: 170.4771, category: "관광" },
        { name: "Fairlie", city: "Fairlie", lat: -44.0990, lng: 170.8280, category: "숙소" },
        { name: "BreakFree on Cashel", city: "Christchurch", lat: -43.5331, lng: 172.6383, category: "숙소" },
        { name: "Riverside Market", city: "Christchurch", lat: -43.5320, lng: 172.6334, category: "관광" },
        { name: "Hilton Auckland", city: "Auckland", lat: -36.8405, lng: 174.7656, category: "숙소" },
        { name: "Commercial Bay", city: "Auckland", lat: -36.8444, lng: 174.7671, category: "쇼핑" },
        { name: "Downtown Ferry Terminal", city: "Auckland", lat: -36.8433, lng: 174.7680, category: "교통" },
        { name: "Rotorua", city: "Auckland", lat: -38.1368, lng: 176.2497, category: "투어" },
        { name: "Waiheke Island", city: "Auckland", lat: -36.7974, lng: 175.1082, category: "투어" }
    ],
    budget: [
        { name: "항공권", amount: 8162600, status: "확정" },
        { name: "숙박", amount: 3988555, status: "확정" },
        { name: "렌터카 · 예약금액 + 연료/부대비용", amount: 1250000, status: "예상", range: "100~150만 원" },
        { name: "식비", amount: 2100000, status: "예상", range: "180~240만 원" },
        { name: "투어 · 액티비티", amount: 1750000, status: "예상", range: "140~210만 원" },
        { name: "대중교통 · 택시", amount: 450000, status: "예상", range: "35~55만 원" },
        { name: "국내교통 · 인천공항 T2 예약주차장(셀토스)", amount: 120000, status: "예상", range: "1/16~1/29 장기주차 이용 결정 · 미예약 · 실주차비 예시 118,000원" },
        { name: "ETA · NZeTA · IVL", amount: 230000, status: "예상" },
        { name: "여행자보험 · eSIM · 예비비", amount: 650000, status: "예상", range: "50~85만 원" }
    ],
    shopping: [
        { item: "UMF 15+ 마누카꿀 250g", target: "양가 부모님", place: "Aotea Gifts · Auckland", priority: "high" },
        { item: "UMF 10+ 마누카꿀", target: "조부모님 / 어른", place: "Auckland", priority: "medium" },
        { item: "Whittaker's Chocolate", target: "형제 · 친척", place: "Woolworths Auckland", priority: "medium" },
        { item: "NZ 스킨케어 / 메리노 제품", target: "형제 · 자매", place: "Aotea Gifts", priority: "medium" },
        { item: "Māori 공예품 / Pounamu", target: "특별 선물", place: "Rotorua · Te Puia", priority: "optional" }
    ]
};
