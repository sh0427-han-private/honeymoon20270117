// Packing quantities are recommendations, per person unless scope is shared.
// Checkmarks are stored in each browser, not in this public repository.
const packingData = {
    travelers: [
        { id: "sanghun", name: "상훈" },
        { id: "jinyeong", name: "진영" },
        { id: "shared", name: "공용" }
    ],
    climate: [
        { region: "시드니 · 오클랜드", dates: "1/17–20 · 1/26–29", clothing: "여름옷 중심", note: "반팔·반바지·얇은 긴바지, 햇빛 차단" },
        { region: "퀸스타운 · 와나카 · 테카포", dates: "1/20–25", clothing: "여름옷 + 가을 겉옷", note: "아침·저녁에는 플리스나 얇은 긴팔 추가" },
        { region: "밀포드 사운드", dates: "1/21", clothing: "방수·방풍 필수 권장", note: "새벽 출발·비·바람 대비: 플리스 위에 방수 재킷" }
    ],
    reminders: [
        { date: "1/16 · 인천공항", title: "한국 겨울 외투", note: "출국 전날과 귀국 후 이동용. 여행 중에는 보관 방법을 별도 고려" },
        { date: "1/21 · 밀포드 사운드", title: "플리스 · 방수 재킷 · 미끄럼 방지 신발", note: "투어 버스와 크루즈 이동. 이어폰·선크림·벌레기피제도 준비" },
        { date: "1/23 · 온센", title: "수영복 · 슬리퍼 · 방수 파우치", note: "온천 이용 후 젖은 수영복을 분리 보관" }
    ],
    categories: [
        {
            id: "clothing", title: "의류 · 신발", scope: "personal",
            items: [
                { id: "tshirt", name: "반팔 티셔츠", quantity: "6~7벌" },
                { id: "shorts", name: "반바지", quantity: "2벌" },
                { id: "pants", name: "긴바지", quantity: "2~3벌" },
                { id: "longsleeve", name: "얇은 긴팔", quantity: "2벌" },
                { id: "fleece", name: "플리스 · 경량 보온복", quantity: "1벌" },
                { id: "rainjacket", name: "방수·방풍 재킷(후드 권장)", quantity: "1벌", note: "바람막이만으로는 폭우 대비가 어려움" },
                { id: "underwear", name: "속옷 · 양말", quantity: "7~9세트" },
                { id: "sleepwear", name: "잠옷", quantity: "1~2벌" },
                { id: "sneakers", name: "미끄럼 방지 운동화", quantity: "1켤레" },
                { id: "sandals", name: "샌들 · 슬리퍼", quantity: "1켤레" },
                { id: "dressy", name: "저녁식사용 단정한 옷", quantity: "1벌 · 선택" }
            ]
        },
        {
            id: "water", title: "온센 · 해변 · 햇빛", scope: "personal",
            items: [
                { id: "swimwear", name: "수영복", quantity: "1벌" },
                { id: "sunglasses", name: "선글라스", quantity: "1개" },
                { id: "hat", name: "챙 있는 모자", quantity: "1개" },
                { id: "quickdry", name: "물놀이 후 갈아입을 옷", quantity: "1세트" }
            ]
        },
        {
            id: "toiletries", title: "세면 · 위생", scope: "personal",
            items: [
                { id: "toothbrush", name: "칫솔 · 치약", quantity: "1세트" },
                { id: "skincare", name: "기초 화장품 · 립밤", quantity: "개인 사용분" },
                { id: "hygiene", name: "개인 위생용품", quantity: "여행 기간분" },
                { id: "laundry", name: "세탁용 작은 파우치", quantity: "1개" }
            ]
        },
        {
            id: "devices", title: "전자기기", scope: "personal",
            items: [
                { id: "phone", name: "휴대전화 · 충전선", quantity: "1세트" },
                { id: "charger", name: "충전 어댑터", quantity: "1개" },
                { id: "earbuds", name: "이어폰", quantity: "1개", note: "밀포드 투어 해설 앱 사용" },
                { id: "powerbank", name: "보조배터리", quantity: "필요 시", note: "항공사 기내 반입 규정 확인" }
            ]
        },
        {
            id: "health", title: "건강 · 개인 물품", scope: "personal",
            items: [
                { id: "medications", name: "평소 복용약 · 처방 관련 자료", quantity: "개인 필요량" },
                { id: "suncream", name: "선크림", quantity: "1개" },
                { id: "repellent", name: "벌레기피제", quantity: "1개" },
                { id: "bottle", name: "휴대용 물병", quantity: "1개" }
            ]
        },
        {
            id: "documents", title: "서류 · 결제", scope: "shared",
            items: [
                { id: "passports", name: "두 사람 여권 · 유효기간 점검", quantity: "각 1개" },
                { id: "permissions", name: "호주·뉴질랜드 입국 허가 확인", quantity: "2인", note: "발급 완료 여부를 별도 확인" },
                { id: "bookings", name: "항공·숙소·투어 예약확인서 오프라인 저장", quantity: "2인 이용 가능" },
                { id: "driving", name: "운전면허 · 렌터카 제출서류", quantity: "운전자 기준", note: "업체와 현지 법적 요건 확인" },
                { id: "cards", name: "해외결제 카드 · 예비 결제수단", quantity: "2종 이상" },
                { id: "insurance", name: "여행자보험 증서 · 긴급 연락처", quantity: "1세트" }
            ]
        },
        {
            id: "sharedbag", title: "공용 짐 · 기내 준비", scope: "shared",
            items: [
                { id: "adapters", name: "호주·뉴질랜드 Type I 변환 플러그", quantity: "2개 내외" },
                { id: "wetbag", name: "젖은 옷용 방수 파우치", quantity: "1~2개" },
                { id: "daypack", name: "관광용 작은 가방", quantity: "1개" },
                { id: "luggage", name: "위탁수하물 크기·무게 확인", quantity: "항공편별" },
                { id: "cabin", name: "기내 가방 7kg 등 적용 규정 재확인", quantity: "항공편별" },
                { id: "souvenirs", name: "귀국 선물용 캐리어 여유 공간", quantity: "구매 전 확보" }
            ]
        }
    ]
};
