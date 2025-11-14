// script.js (データ構造を削除したロジックのみのファイル)

// ALL_POINTS, MAIN_AREA_POINTS, GOSHOURA_POINTS, TRAVEL_MATRIX, 
// FACILITY_DATA, TRAVEL_POINTS_DATA は data.js から読み込まれます。


// --- UI操作関数 ---

/**
 * 検索モードとフォーム入力を取得
 * @param {'start' | 'end'} type - 起点か終点か
 * @returns {{mode: string, town: string, houseNumber: string, facilityName: string, isFacility: boolean}}
 */
function getPointInput(type) {
    const isAddressMode = document.getElementById(`${type}-mode-address`).classList.contains('active');
    
    if (isAddressMode) {
        return {
            mode: 'address',
            town: document.getElementById(`${type}-town-name`).value.trim(),
            houseNumber: document.getElementById(`${type}-house-number`).value.trim(),
            facilityName: null,
            isFacility: false
        };
    } else {
        const facilitySelect = document.getElementById(`${type}-facility-select`);
        return {
            mode: 'facility',
            town: null,
            houseNumber: null,
            facilityName: facilitySelect.value,
            isFacility: true
        };
    }
}

/**
 * 検索ロジックの中核。起点と終点の両方を特定し、旅費を検索する。
 */
function searchTravelCost() {
    const startInput = getPointInput('start');
    const endInput = getPointInput('end');

    let startTown, startHouseNum, startFacility, startInputDisplay;
    let endTown, endHouseNum, endFacility, endInputDisplay;
    
    // 1. 入力チェックと地番情報の準備（起点）
    if (startInput.mode === 'address') {
        if (!startInput.town || !startInput.houseNumber) {
            alert("起点の町名と地番を入力してください。");
            return;
        }
        startTown = startInput.town;
        startHouseNum = parseToNumeric(startInput.houseNumber);
        startInputDisplay = `起点住所: ${startTown} ${startInput.houseNumber}`;
    } else {
        if (!startInput.facilityName) {
            alert("起点の施設を選択してください。");
            return;
        }
        startFacility = FACILITY_DATA.find(f => f.name === startInput.facilityName);
        const parts = parseAddress(startFacility.address);
        startTown = parts.townName;
        startHouseNum = parseToNumeric(parts.houseNumber);
        startInputDisplay = `起点施設: ${startFacility.name} (${startFacility.address})`;
    }

    // 2. 入力チェックと地番情報の準備（終点）
    if (endInput.mode === 'address') {
        if (!endInput.town || !endInput.houseNumber) {
            alert("終点の町名と地番を入力してください。");
            return;
        }
        endTown = endInput.town;
        endHouseNum = parseToNumeric(endInput.houseNumber);
        endInputDisplay = `終点住所: ${endTown} ${endInput.houseNumber}`;
    } else {
        if (!endInput.facilityName) {
            alert("終点の施設を選択してください。");
            return;
        }
        endFacility = FACILITY_DATA.find(f => f.name === endInput.facilityName);
        const parts = parseAddress(endFacility.address);
        endTown = parts.townName;
        endHouseNum = parseToNumeric(parts.houseNumber);
        endInputDisplay = `終点施設: ${endFacility.name} (${endFacility.address})`;
    }

    // 3. 地点の特定
    const startPointRaw = getTravelPoint(startTown, startHouseNum);
    const endPointRaw = getTravelPoint(endTown, endHouseNum);

    // 4. 地点特定エラーの処理
    if (startPointRaw.startsWith("エラー:") || endPointRaw.startsWith("エラー:")) {
        const errorPoint = startPointRaw.startsWith("エラー:") ? "起点" : "終点";
        const errorMessage = startPointRaw.startsWith("エラー:") ? startPointRaw : endPointRaw;
        displayError(`エラー: ${errorPoint}の特定に失敗しました。`, `${startInputDisplay}\n${endInputDisplay}`, errorMessage);
        return;
    }

    // 5. 旅費計算に使用する地点名（曖昧さを解消）
    const startPoint = resolveAmbiguousPoint(startPointRaw);
    const endPoint = resolveAmbiguousPoint(endPointRaw);

    const costData = getTravelCost(startPoint, endPoint); 

    const isAmbiguous = startPointRaw.includes("OR") || startPointRaw.includes("or") || endPointRaw.includes("OR") || endPointRaw.includes("or");

    displayResult(
        `${startInputDisplay}\n${endInputDisplay}`,
        `${startPointRaw} → ${endPointRaw}`,
        endPointRaw, // 終点特定地点
        startPoint, // 計算に使った起点
        endPoint, // 計算に使った終点
        costData, 
        isAmbiguous
    );
}

// --- displayResult 関数の修正（引数と表示内容の変更） ---
function displayResult(input, segmentRaw, endPointRaw, startPointUsed, endPointUsed, costData, isAmbiguous) {
    const resultArea = document.getElementById('result-area');
    const inputDisplay = document.getElementById('search-input-display');
    const segmentDisplay = document.getElementById('travel-segment-display');
    const pointDisplay = document.getElementById('travel-point-display');
    const costDisplay = document.getElementById('travel-cost-display'); 
    const noteDisplay = document.getElementById('note-display');

    inputDisplay.textContent = input;
    segmentDisplay.textContent = `${startPointUsed} → ${endPointUsed}`;
    pointDisplay.textContent = endPointRaw;
    
    // --- 旅費情報の表示 ---
    if (costData.error) {
        return displayError(`旅費データ検索失敗`, input, costData.error);
    }
    
    costDisplay.textContent = `片道 ${costData.distance} km / 往復 ¥${costData.amount.toLocaleString()}`; 
    // ----------------------
    
    resultArea.style.borderColor = isAmbiguous ? '#ffc107' : '#28a745'; 
    
    if (isAmbiguous) {
        segmentDisplay.textContent = `${startPointRaw.replace(" OR ", " or ").replace(" or ", " → ")} → ${endPointRaw.replace(" OR ", " or ").replace(" or ", " → ")}`;
        pointDisplay.textContent = `${endPointRaw} (計算には「${endPointUsed}」を使用)`;
        noteDisplay.textContent = `※「or」を含む結果は、旅費規定の運用に基づき、いずれかの地点を適用してください。旅費は概算として、「${startPointUsed}」を起点に「${endPointUsed}」の値を表示しています。`;
        resultArea.style.backgroundColor = '#fff3cd';
    } else {
        segmentDisplay.textContent = `${startPointUsed} → ${endPointUsed}`;
        pointDisplay.textContent = endPointRaw;
        noteDisplay.textContent = "※ 特定された地点が旅費算定の基準となります。";
        resultArea.style.backgroundColor = '#e9f7ff';
    }
}

function displayError(title, input, message) {
    const resultArea = document.getElementById('result-area');
    resultArea.style.borderColor = '#dc3545';
    resultArea.style.backgroundColor = '#f8d7da';
    document.getElementById('search-input-display').textContent = input;
    document.getElementById('travel-segment-display').textContent = title;
    document.getElementById('travel-point-display').textContent = '---';
    document.getElementById('travel-cost-display').textContent = message;
    document.getElementById('note-display').textContent = "※ 地点特定または旅費データ検索に失敗しました。入力内容を確認してください。";
}

// --- 初期化ロジックとイベントリスナーの追加（変更なし） ---

function setupModeSwitcher(type) {
    const addressBtn = document.getElementById(`${type}-mode-address`);
    const facilityBtn = document.getElementById(`${type}-mode-facility`);
    const addressForm = document.getElementById(`${type}-address-form`);
    const facilityForm = document.getElementById(`${type}-facility-form`);
    
    addressBtn.addEventListener('click', () => {
        addressBtn.classList.add('active');
        facilityBtn.classList.remove('active');
        addressForm.classList.remove('hidden');
        facilityForm.classList.add('hidden');
    });

    facilityBtn.addEventListener('click', () => {
        facilityBtn.classList.add('active');
        addressBtn.classList.remove('active');
        facilityForm.classList.remove('hidden');
        addressForm.classList.add('hidden');
    });
}

function initializeApp() {
    // FACILITY_DATAがdata.jsから読み込まれていることを前提とする
    const facilitySelectStart = document.getElementById('start-facility-select');
    const facilitySelectEnd = document.getElementById('end-facility-select');

    // 施設選択ドロップダウンの準備
    const uniqueFacilities = [];
    const seen = new Set();
    FACILITY_DATA.forEach(facility => {
        const key = facility.name + '|' + facility.address;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueFacilities.push(facility);
        }
    });

    const getFacilityType = (name) => {
        if (name.includes('市役所') || name.includes('支所')) return 1; 
        if (name.includes('公民館') || name.includes('コミュニティセンター') || name.includes('交流センター')) return 2; 
        if (name.includes('中学校')) return 3; 
        if (name.includes('小学校')) return 4; 
        if (name.includes('幼稚園')) return 5; 
        if (name.includes('体育館') || name.includes('グラウンド') || name.includes('運動広場') || name.includes('テニスコート') || name.includes('相撲場')) return 6; 
        if (name.includes('図書館') || name.includes('博物館') || name.includes('資料館') || name.includes('アーカイブズ') || name.includes('生涯学習センター') || name.includes('市民センター')) return 7; 
        if (name.includes('給食センター')) return 8; 
        return 9; 
    };
    
    const sortedFacilities = uniqueFacilities.sort((a, b) => {
        const typeA = getFacilityType(a.name);
        const typeB = getFacilityType(b.name);
        if (typeA !== typeB) {
            return typeA - typeB; 
        }
        return a.name.localeCompare(b.name, 'ja'); 
    });

    sortedFacilities.forEach(facility => {
        const option = document.createElement('option');
        option.value = facility.name;
        option.textContent = facility.name;
        facilitySelectStart.appendChild(option.cloneNode(true));
        facilitySelectEnd.appendChild(option.cloneNode(true));
    });

    // モードスイッチャーのセットアップ
    setupModeSwitcher('start');
    setupModeSwitcher('end');

    // ページロード時の初期リセット
    const resultArea = document.getElementById('result-area');
    resultArea.style.borderColor = '#ccc';
    resultArea.style.backgroundColor = '#f9f9f9';
}

// グローバルスコープに関数を公開
window.searchTravelCost = searchTravelCost;

window.onload = initializeApp;

// =========================================================================
// === 共通ユーティリティ関数 ===
// =========================================================================

/**
 * 住所文字列から数値化された地番を抽出する
 */
function parseToNumeric(houseNumberStr) {
    if (!houseNumberStr) return 0;
    
    // 全角数字を半角に変換
    let cleanStr = houseNumberStr.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
    
    // 「番地」「番」「号」を統一的にピリオドに変換（順序重要）
    cleanStr = cleanStr.replace(/番地/g, '.');
    cleanStr = cleanStr.replace(/番/g, '.');
    cleanStr = cleanStr.replace(/号/g, '.');
    cleanStr = cleanStr.replace(/の/g, '.');
    
    // ハイフンもピリオドに変換
    cleanStr = cleanStr.replace(/[-ー]/g, '.');
    
    // 複数のピリオドを整理（最初の2つまで残す）
    const parts = cleanStr.split('.').filter(p => p.length > 0);
    if (parts.length >= 2) {
        cleanStr = parts[0] + '.' + parts[1];
    } else if (parts.length === 1) {
        cleanStr = parts[0];
    }
    
    return parseFloat(cleanStr.trim());
}

/**
 * 完全な住所文字列から町名と地番を抽出する
 */
function parseAddress(fullAddress) {
    const parts = fullAddress.split('天草市');
    if (parts.length < 2) return { townName: "", houseNumber: "" };
    
    const address = parts[1].trim();
    
    // 数字（半角/全角）が最初に出現する位置を探す
    const match = address.match(/^(.+?)([0-9０-９]+.*)$/);
    
    if (match && match[1] && match[2]) {
        return { 
            townName: match[1].trim(), 
            houseNumber: match[2].trim() 
        };
    } else {
        return { 
            townName: address.trim(), 
            houseNumber: "" 
        };
    }
}


/**
 * 町名と地番から旅費地点を特定する
 * @param {string} townName - 町名
 * @param {number} numericHouseNumber - 数値化された地番
 * @returns {string} - 確定または曖昧な地点名、またはエラーメッセージ
 */
function getTravelPoint(townName, numericHouseNumber) {
    try {
        const cleanInputTown = townName.replace(/町$/, '').trim();

        let targetEntry = TRAVEL_POINTS_DATA.find(entry => {
            if (entry.town === townName) return true;
            if (entry.town.replace(/町$/, '').trim() === cleanInputTown) return true;
            if (entry.town.includes(cleanInputTown) && cleanInputTown.length > 1) return true;
            return false;
        });

        if (!targetEntry && !['東町', '浄南町', '太田町'].some(ex => townName.includes(ex))) {
            const catchAllEntry = TRAVEL_POINTS_DATA.find(entry => entry.town === '東・浄南・太田町以外');
            if (catchAllEntry) {
                targetEntry = catchAllEntry;
            }
        }
        
        if (!targetEntry) {
            return `エラー: 入力された町名「${townName}」に該当する旅費データが見つかりません。`;
        }

        for (let i = 0; i < targetEntry.ranges.length; i++) {
            const range = targetEntry.ranges[i];
            const rangeStart = range.start;
            const rangeEnd = range.end;
            
            if (numericHouseNumber >= rangeStart && numericHouseNumber < rangeEnd) {
                // 御所浦の大浦を正規化
                if (range.location === '大浦' && (townName.includes('御所浦町御所浦') || townName.includes('御所浦町'))) {
                    return "大浦(御所浦)";
                }
                return range.location;
            }
        }
        
        return "エラー: 入力された地番の範囲を特定できませんでした。";
        
    } catch (e) {
        return "エラー: 検索ロジック処理中に例外が発生しました。";
    }
}

/**
 * 2つの地点間の距離と金額を取得する
 * @param {string} startPoint - 起点地点名 (曖昧さ解消済み)
 * @param {string} endPoint - 終点地点名 (曖昧さ解消済み)
 * @returns {{distance: number, amount: number, error: string}}
 */
function getTravelCost(startPoint, endPoint) {
    // TRAVEL_MATRIXがdata.jsからグローバルスコープで利用可能であることを前提とする
    const matrix = TRAVEL_MATRIX[startPoint];
    if (!matrix) {
        return { distance: null, amount: null, error: `エラー: 起点「${startPoint}」のデータが見つかりません。` };
    }
    
    const cost = matrix[endPoint];
    if (!cost) {
        return { distance: null, amount: null, error: `エラー: 「${startPoint}」から「${endPoint}」への旅費データが見つかりません。` };
    }
    
    return { ...cost, error: null };
}

/**
 * 複数の可能性のある地点名から、計算に使用する単一の地点名を決定する
 * @param {string} pointName - "A OR B" 形式の地点名
 * @returns {string} - 計算に使う単一の地点名
 */
function resolveAmbiguousPoint(pointName) {
    if (pointName.startsWith("エラー:")) return pointName;
    
    // 御所浦の大浦を正規化
    if (pointName === '大浦') return "大浦"; // メインエリアの大浦
    if (pointName === '大浦(御所浦)') return "大浦(御所浦)"; // 御所浦の大浦

    if (pointName.includes("OR") || pointName.includes("or")) {
        // "A OR B" の形式の場合、最初の地点 "A" を使用
        return pointName.split("OR")[0].split("or")[0].trim();
    }
    return pointName;
}
