/**
 * sbscontentip.co.kr - Data Rendering Logic
 */
const CONFIG = {
    sheetId: '1hMmQU6g2Zl5AFhScN8CKfVdgcibyuk40OLsNCMgR5Mw', // 본인의 스프레드시트 ID를 입력하세요.
    tabName: 'Sheet1'
};

const DATA_URL = `https://docs.google.com/spreadsheets/d/${CONFIG.sheetId}/gviz/tq?tqx=out:json&sheet=${CONFIG.tabName}`;

let masterData = [];

// 1. 초기 데이터 로드
async function fetchSheetData() {
    try {
        const response = await fetch(DATA_URL);
        const text = await response.text();
        const json = JSON.parse(text.substr(47).slice(0, -2));
        
        masterData = json.table.rows.map(row => ({
            title: row.c[0]?.v || '',
            category: row.c[1]?.v?.toLowerCase() || '',
            desc: row.c[2]?.v || '',
            image: row.c[3]?.v || '',
            extra: row.c[4]?.v || '', // 구독자수, 파트너 로고, 혹은 가격
            url: row.c[5]?.v || '#'
        }));

        renderCards(masterData);
    } catch (error) {
        console.error("데이터 로드 실패:", error);
        document.getElementById('content-grid').innerHTML = `<p class='col-span-full text-center py-10'>데이터를 불러올 수 없습니다. 시트 설정을 확인하세요.</p>`;
    }
}

// 2. 카드 렌더링 엔진
function renderCards(data) {
    const grid = document.getElementById('content-grid');
    grid.innerHTML = data.map(item => {
        if (item.category === 'ip') return createIPCard(item);
        if (item.category === 'collab') return createCollabCard(item);
        if (item.category === 'goods') return createGoodsCard(item);
        return '';
    }).join('');
}

// [컴포넌트 1] 주요 IP 카드 (지표 강조)
function createIPCard(item) {
    return `
    <div class="card-hover bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col">
        <div class="relative group overflow-hidden">
            <img src="${item.image}" class="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-110" alt="${item.title}">
            <div class="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter text-blue-600 shadow-sm">Premium IP</div>
        </div>
        <div class="p-8 flex-1 flex flex-col">
            <h3 class="text-2xl font-black mb-3">${item.title}</h3>
            <p class="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">${item.desc}</p>
            <div class="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
                <span class="text-blue-600 font-extrabold text-sm"><i class="fas fa-chart-simple mr-2"></i>${item.extra}</span>
                <a href="${item.url}" target="_blank" class="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    </div>`;
}

// [컴포넌트 2] 협업 레퍼런스 (파트너십 강조)
function createCollabCard(item) {
    return `
    <div class="card-hover bg-slate-900 rounded-[2rem] p-8 border border-slate-800 flex flex-col justify-between min-h-[320px]">
        <div>
            <div class="flex items-center gap-4 mb-8">
                <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-2 shadow-inner overflow-hidden">
                    <img src="${item.extra}" alt="partner" class="max-w-full grayscale hover:grayscale-0 transition-all">
                </div>
                <span class="text-slate-500 text-[10px] font-bold tracking-[0.2em] uppercase">Partnership</span>
            </div>
            <h3 class="text-white text-xl font-bold mb-3">${item.title}</h3>
            <p class="text-slate-400 text-sm leading-relaxed">${item.desc}</p>
        </div>
        <div class="mt-8 flex items-center text-blue-400 text-xs font-bold">
            <span class="px-3 py-1 rounded-md bg-blue-400/10 border border-blue-400/20">Success Case</span>
        </div>
    </div>`;
}

// [컴포넌트 3] 상품/서비스 (구매 유도)
function createGoodsCard(item) {
    return `
    <div class="card-hover bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[2rem] p-8 border border-blue-100 flex flex-col items-center text-center">
        <div class="w-24 h-24 bg-white rounded-3xl shadow-xl shadow-blue-200/50 flex items-center justify-center mb-6 overflow-hidden">
            <img src="${item.image}" class="w-full h-full object-cover" alt="${item.title}">
        </div>
        <h3 class="text-xl font-black mb-2">${item.title}</h3>
        <p class="text-blue-600 font-black text-2xl mb-4">${item.extra}</p>
        <p class="text-slate-500 text-xs mb-8 leading-relaxed px-4">${item.desc}</p>
        <a href="${item.url}" class="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-300 hover:bg-blue-700 transition-all">
            상세보기 / 신청
        </a>
    </div>`;
}

// 3. 필터링 기능
function filterItems(category) {
    // 버튼 스타일 업데이트
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('filter-active'));
    event.target.classList.add('filter-active');

    // 필터링 적용
    const filtered = category === 'all' ? masterData : masterData.filter(d => d.category === category);
    renderCards(filtered);
}

// 실행
fetchSheetData();
