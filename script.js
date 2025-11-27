// --- ユーティリティ関数 ---

/**
 * 住所文字列から数値化された地番を抽出する
 */
function parseToNumeric(houseNumberStr) {
    if (!houseNumberStr) return 0;
    
    // 全角数字を半角に変換
    let cleanStr = houseNumberStr.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
    
    // 全角ハイフンを半角に変換
    cleanStr = cleanStr.replace(/[ー－]/g, '-');
    
    // 「番地」「番」「号」「の」を統一的にピリオドに変換（順序重要）
    cleanStr = cleanStr.replace(/番地/g, '.');
    cleanStr = cleanStr.replace(/番/g, '.');
    cleanStr = cleanStr.replace(/号/g, '.');
    cleanStr = cleanStr.replace(/の/g, '.');
    
    // ハイフンもピリオドに変換
    cleanStr = cleanStr.replace(/[-]/g, '.');
    
    // 余分な文字を削除（数字とピリオドのみ残す）
    cleanStr = cleanStr.replace(/[^0-9.]/g, '');
    
    // 複数のピリオドを整理（最初の1つまたは2つまで残す: 地番の第1・第2要素のみを考慮）
    const parts = cleanStr.split('.').filter(p => p.length > 0 && !isNaN(p));
    if (parts.length >= 2) {
        cleanStr = parts[0] + '.' + parts[1];
    } else if (parts.length === 1) {
        cleanStr = parts[0];
    } else {
        return 0;
    }
    
    const result = parseFloat(cleanStr.trim());
    return isNaN(result) ? 0 : result;
}

/**
 * 完全な住所文字列から町名と地番を抽出する
 * 改善: 「天草市」が含まれていない場合や表記揺れに対応
 */
function parseAddress(fullAddress) {
    let addressBody = fullAddress;
    
    // "天草市"があればそこで分割、なければ全体を対象
    if (fullAddress.includes('天草市')) {
        addressBody = fullAddress.split('天草市')[1];
    }
    
    addressBody = addressBody.trim();
    
    // 数字（半角/全角）が最初に出現する位置を探す
    // パターン: (数字以外の文字列)(数字+任意の文字)
    const match = addressBody.match(/^([^0-9０-９]+)([\d０-９]+.*)$/);
    
    if (match && match[1] && match[2]) {
        return { 
            townName: match[1].trim(), 
            houseNumber: match[2].trim() 
        };
    } else {
        // 数字が見つからない場合は全体を町名とする
        return { 
            townName: addressBody, 
            houseNumber: "" 
        };
    }
}

// --- 旅費地点検索ロジック (コアロジック) ---

/**
 * 町名と地番から旅費地点を特定する
 */
function getTravelPoint(townName, numericHouseNumber) {
    try {
        console.log(`[検索] 町名: "${townName}", 地番: ${numericHouseNumber}`);
        
        const normalizedTownName = townName.trim();
        
        // 1. データ内で町名を探す (検索ロジック強化版)
        let targetEntry = null;
        
        // 正規化: 全角英数字を半角に、熊本県・天草市・余分なスペースを削除
        const cleanTownName = normalizedTownName
            .replace(/[Ａ-Ｚａ-ｚ０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
            .replace(/熊本県/g, '')
            .replace(/天草市/g, '')
            .replace(/\s+/g, '');

        // 判定ロジック関数
        const isMatch = (dataTown) => {
            const cleanData = dataTown.replace(/\s+/g, '');
            
            // A. 完全一致
            if (cleanData === cleanTownName) return true;
            
            // B. 末尾の"町"を除いた一致 (例: "東町" vs "東")
            if (cleanData.replace(/町$/, '') === cleanTownName) return true;
            
            // C. 旧町名(五和町など)を含んだデータに対し、字名のみでの入力に対応
            // 例: data="五和町御領" vs input="御領"
            const oldTowns = ['本渡町', '牛深町', '有明町', '御所浦町', '倉岳町', '栖本町', '新和町', '五和町', '天草町', '河浦町'];
            for (const old of oldTowns) {
                if (cleanData.startsWith(old)) {
                    // "五和町御領" から "五和町" を削除 -> "御領"
                    const subName = cleanData.replace(old, '');
                    if (subName === cleanTownName) return true;
                }
            }
            return false;
        };

        // マッチするエントリを検索
        targetEntry = TRAVEL_POINTS_DATA.find(entry => isMatch(entry.town));
        
        // 2. 東浜町などの「東・浄南・太田町以外は本渡」ルールを適用
        if (!targetEntry) {
            const specialTowns = ['東町', '浄南町', '太田町'];
            // 入力された町名が特殊な町名を含んでいるかチェック
            const isSpecialTown = specialTowns.some(ex => 
                cleanTownName.includes(ex) || cleanTownName === ex || cleanTownName + "町" === ex
            );
            
            if (!isSpecialTown) {
                targetEntry = TRAVEL_POINTS_DATA.find(entry => 
                    entry.town === '東・浄南・太田町以外'
                );
                console.log('[検索] 特例ルール「東・浄南・太田町以外」を適用');
            }
        }
        
        if (!targetEntry) {
            console.error(`[エラー] 町名「${normalizedTownName}」に該当するデータが見つかりません`);
            return `エラー: 入力された町名「${normalizedTownName}」に該当する旅費データが見つかりません。正しい町名を入力してください（例：${townName.includes('御領') ? '五和町御領' : '五和町○○'}）。`;
        }

        console.log(`[検索] マッチした町名: "${targetEntry.town}"`);

        // 3. 範囲を順番にチェック
        for (let i = 0; i < targetEntry.ranges.length; i++) {
            const range = targetEntry.ranges[i];
            const rangeStart = range.start;
            const rangeEnd = range.end;
            
            console.log(`[範囲チェック] ${rangeStart} <= ${numericHouseNumber} < ${rangeEnd} → ${range.location}`);
            
            // 基本の範囲判定: start以上、end未満
            // ただし、endが99999の場合は事実上の上限なしとして扱う
            const inRange = (numericHouseNumber >= rangeStart) && 
                           (rangeEnd >= 99999 || numericHouseNumber < rangeEnd);
            
            if (inRange) {
                console.log(`[結果] 地点: ${range.location}`);
                return range.location;
            }
        }
        
        console.error(`[エラー] 地番 ${numericHouseNumber} がどの範囲にも該当しませんでした`);
        return `エラー: 入力された地番「${numericHouseNumber}」の範囲を特定できませんでした。データ範囲: ${targetEntry.ranges.map(r => `${r.start}-${r.end}`).join(', ')}`;
        
    } catch (e) {
        console.error("検索処理中に致命的なエラーが発生しました:", e);
        return `エラー: 検索ロジック処理中に例外が発生しました。(${e.message})`;
    }
}

/**
 * 2つの地点間の旅費を計算する
 */
function calculateTravelCost(startPoint, endPoint) {
    console.log(`[旅費計算] ${startPoint} → ${endPoint}`);
    
    // 1. エラーチェック（地点特定失敗）
    if (startPoint.startsWith("エラー:") || endPoint.startsWith("エラー:")) {
        return {
            error: true,
            message: "起点または終点の特定に失敗しました。"
        };
    }

    // ORやorを含む場合の処理（複数の組み合わせがある場合は最初の組み合わせを使用）
    const startPoints = startPoint.split(/\s+or\s+|OR/).map(p => p.trim());
    const endPoints = endPoint.split(/\s+or\s+|OR/).map(p => p.trim());
    const actualStart = startPoints[0];
    const actualEnd = endPoints[0];

    // 2. 計算対象外地点のチェック（横浦など船のみの場所）
    const isShipOnly = (point) => point.includes("船のみ");
    if (isShipOnly(actualStart) || isShipOnly(actualEnd)) {
        return {
            error: true,
            message: `地点「${isShipOnly(actualStart) ? actualStart : actualEnd}」は船移動が必要なため、このアプリでは旅費算定の対象外です。別途船賃等の確認が必要です。`
        };
    }
    
    console.log(`[実際の計算] ${actualStart} → ${actualEnd}`);
    
    // 3. 旅費データの取得とエラーハンドリング
    if (TRAVEL_MATRIX[actualStart] && TRAVEL_MATRIX[actualStart][actualEnd]) {
        const data = TRAVEL_MATRIX[actualStart][actualEnd];
        return {
            error: false,
            distance: data.distance,
            amount: data.amount,
            isAmbiguous: startPoints.length > 1 || endPoints.length > 1,
            actualStart: actualStart,
            actualEnd: actualEnd
        };
    } else {
        console.error(`[エラー] ${actualStart} → ${actualEnd} の旅費データが見つかりません`);
        
        // エリア跨ぎの判定
        const isStartMain = MAIN_AREA_POINTS.includes(actualStart);
        const isEndMain = MAIN_AREA_POINTS.includes(actualEnd);
        const isStartGoshoura = GOSHOURA_POINTS.includes(actualStart);
        const isEndGoshoura = GOSHOURA_POINTS.includes(actualEnd);

        let errorMsg = `地点「${actualStart}」から「${actualEnd}」への旅費データが見つかりません。`;

        if ((isStartMain && isEndGoshoura) || (isStartGoshoura && isEndMain)) {
            errorMsg += "\n（本土側と御所浦島内を跨ぐ移動の旅費データは登録されていません。船移動が含まれるため、別途規定を確認してください。）";
        } else {
            errorMsg += "データが未登録の可能性があります。";
        }

        return {
            error: true,
            message: errorMsg
        };
    }
}

// --- UI操作関数 ---

function displayResult(startInput, endInput, startPoint, endPoint, costData) {
    const resultArea = document.getElementById('result-area');
    const segmentDisplay = document.getElementById('travel-segment-display');
    const inputDisplay = document.getElementById('search-input-display');
    const costDisplay = document.getElementById('travel-cost-display');
    const noteDisplay = document.getElementById('note-display');
    
    // 境界の色と背景色をリセット/初期設定
    resultArea.style.borderColor = '#28a745';
    resultArea.style.backgroundColor = '#d4edda';
    costDisplay.style.color = '#28a745';
    noteDisplay.textContent = '※ 特定された地点間の旅費が算定されました。往復金額は片道金額の2倍です。';

    // 起点/終点の表示
    segmentDisplay.textContent = `${startPoint} → ${endPoint}`;
    
    // 入力元の表示
    inputDisplay.innerHTML = `<strong>起点:</strong> ${startInput}<br><strong>終点:</strong> ${endInput}`;
    
    // エラー処理
    if (costData.error) {
        resultArea.style.borderColor = '#dc3545';
        resultArea.style.backgroundColor = '#f8d7da';
        costDisplay.textContent = '算出不可';
        costDisplay.style.color = '#dc3545';
        noteDisplay.textContent = `※ ${costData.message}`;
        return;
    }

    // 旅費の表示
    costDisplay.textContent = `${costData.amount}円 / ${costData.distance}km`;
    
    // 境界の色設定（曖昧な場合）
    if (costData.isAmbiguous) {
        resultArea.style.borderColor = '#ffc107';
        resultArea.style.backgroundColor = '#fff3cd';
        costDisplay.style.color = '#d9534f'; // 曖昧な場合は警告色
        noteDisplay.textContent = `※ 「or」または「OR」を含む結果は、旅費規定の運用に基づき、いずれかの地点を適用してください。実際の計算: ${costData.actualStart} → ${costData.actualEnd}`;
    }
}

function searchTravelCost() {
    console.log('[検索開始] 旅費計算を開始します');
    
    // 起点の取得
    let startTown = '', startHouseNum = '', startInput = '', startPoint = '';
    const startMode = document.getElementById('start-mode-address').classList.contains('active') ? 'address' : 'facility';
    
    if (startMode === 'address') {
        startTown = document.getElementById('start-town-name').value.trim();
        startHouseNum = document.getElementById('start-house-number').value.trim();
        
        if (!startTown || !startHouseNum) {
            alert('起点の町名と地番を入力してください。');
            return;
        }
        
        const numericStart = parseToNumeric(startHouseNum);
        console.log(`[起点・住所] 町名: "${startTown}", 地番: "${startHouseNum}" (${numericStart})`);
        
        if (numericStart === 0 && startHouseNum !== '0') { // 0番地でない場合
            alert('起点の地番の形式が正しくありません。');
            return;
        }
        
        startPoint = getTravelPoint(startTown, numericStart);
        startInput = `住所: ${startTown} ${startHouseNum} (${numericStart})`;
        
    } else {
        const facilityName = document.getElementById('start-facility-select').value;
        if (!facilityName) {
            alert('起点の施設を選択してください。');
            return;
        }
        
        const facility = FACILITY_DATA.find(f => f.name === facilityName);
        if (!facility) {
            alert('起点の施設データが見つかりません。');
            return;
        }
        
        const addressParts = parseAddress(facility.address);
        console.log(`[起点・施設] ${facilityName}: 町名="${addressParts.townName}", 地番="${addressParts.houseNumber}"`);
        
        const numericStart = parseToNumeric(addressParts.houseNumber);
        startPoint = getTravelPoint(addressParts.townName, numericStart);
        startInput = `施設: ${facilityName}<br>住所: ${facility.address}`;
    }
    
    // 終点の取得
    let endTown = '', endHouseNum = '', endInput = '', endPoint = '';
    const endMode = document.getElementById('end-mode-address').classList.contains('active') ? 'address' : 'facility';
    
    if (endMode === 'address') {
        endTown = document.getElementById('end-town-name').value.trim();
        endHouseNum = document.getElementById('end-house-number').value.trim();
        
        if (!endTown || !endHouseNum) {
            alert('終点の町名と地番を入力してください。');
            return;
        }
        
        const numericEnd = parseToNumeric(endHouseNum);
        console.log(`[終点・住所] 町名: "${endTown}", 地番: "${endHouseNum}" (${numericEnd})`);
        
        if (numericEnd === 0 && endHouseNum !== '0') { // 0番地でない場合
            alert('終点の地番の形式が正しくありません。');
            return;
        }
        
        endPoint = getTravelPoint(endTown, numericEnd);
        endInput = `住所: ${endTown} ${endHouseNum} (${numericEnd})`;
        
    } else {
        const facilityName = document.getElementById('end-facility-select').value;
        if (!facilityName) {
            alert('終点の施設を選択してください。');
            return;
        }
        
        const facility = FACILITY_DATA.find(f => f.name === facilityName);
        if (!facility) {
            alert('終点の施設データが見つかりません。');
            return;
        }
        
        const addressParts = parseAddress(facility.address);
        console.log(`[終点・施設] ${facilityName}: 町名="${addressParts.townName}", 地番="${addressParts.houseNumber}"`);
        
        const numericEnd = parseToNumeric(addressParts.houseNumber);
        endPoint = getTravelPoint(addressParts.townName, numericEnd);
        endInput = `施設: ${facilityName}<br>住所: ${facility.address}`;
    }
    
    // 旅費計算
    const costData = calculateTravelCost(startPoint, endPoint);
    console.log('[旅費計算結果]', costData);
    
    // 結果表示
    displayResult(startInput, endInput, startPoint, endPoint, costData);

    // 【追加】結果エリアまでスムーズにスクロールする（スマホ対策）
    document.getElementById('result-area').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// --- 初期化・セットアップ ---

function getFacilityType(name) {
    if (name.includes('市役所') || name.includes('支所')) return 1; 
    if (name.includes('公民館') || name.includes('コミュニティセンター') || name.includes('交流センター')) return 2; 
    if (name.includes('中学校')) return 3; 
    if (name.includes('小学校')) return 4; 
    if (name.includes('幼稚園')) return 5; 
    if (name.includes('体育館') || name.includes('グラウンド') || name.includes('運動広場') || name.includes('テニスコート') || name.includes('相撲場')) return 6; 
    if (name.includes('図書館') || name.includes('博物館') || name.includes('資料館') || name.includes('アーカイブズ') || name.includes('生涯学習センター') || name.includes('市民センター')) return 7; 
    if (name.includes('給食センター')) return 8; 
    return 9; 
}

function populateFacilitySelect(selectId) {
    const select = document.getElementById(selectId);
    
    const uniqueFacilities = [];
    const seen = new Set();

    FACILITY_DATA.forEach(facility => {
        // 修正: 施設名のみで重複排除を行う
        const key = facility.name;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueFacilities.push(facility);
        }
    });

    // ソート
    const sortedFacilities = uniqueFacilities.sort((a, b) => {
        const typeA = getFacilityType(a.name);
        const typeB = getFacilityType(b.name);

        if (typeA !== typeB) {
            return typeA - typeB; 
        }
        return a.name.localeCompare(b.name, 'ja'); 
    });

    // オプション追加
    sortedFacilities.forEach(facility => {
        const option = document.createElement('option');
        option.value = facility.name;
        option.textContent = facility.name;
        select.appendChild(option);
    });
}

/**
 * 町名オートコンプリート用のDatalistを設定
 */
function setupDatalist() {
    const townList = document.getElementById('town-list');
    if (!townList) return;

    TRAVEL_POINTS_DATA.forEach(entry => {
        // "東・浄南・太田町以外" などの特殊エントリを除外してリスト化
        if (!entry.town.includes('以外')) {
            const option = document.createElement('option');
            option.value = entry.town;
            townList.appendChild(option);
        }
    });
}

/**
 * UIイベントリスナーの設定（リセット機能、Enterキー検索）
 */
function setupInputListeners() {
    const inputs = document.querySelectorAll('input, select');
    const resultArea = document.getElementById('result-area');
    const segmentDisplay = document.getElementById('travel-segment-display');
    
    inputs.forEach(input => {
        // 入力変更時のリセット処理
        input.addEventListener('input', () => {
            segmentDisplay.textContent = '---';
            document.getElementById('search-input-display').textContent = '---';
            document.getElementById('travel-cost-display').textContent = '---';
            // スタイルをデフォルトに戻す
            resultArea.style.backgroundColor = '#e9f7ff'; 
            resultArea.style.borderColor = '#28a745'; 
            document.getElementById('note-display').textContent = '※ 条件を変更した場合は再度「旅費を検索」ボタンを押してください。';
        });

        // Enterキーでの検索実行
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                // フォーカスを外してモバイルキーボードを閉じる等の挙動も考慮
                input.blur();
                searchTravelCost();
            }
        });
    });
}

function setupModeSwitchers() {
    // モード切替時のリセット処理
    const resetStartForms = () => {
        document.getElementById('start-town-name').value = '';
        document.getElementById('start-house-number').value = '';
        document.getElementById('start-facility-select').value = '';
    };

    const resetEndForms = () => {
        document.getElementById('end-town-name').value = '';
        document.getElementById('end-house-number').value = '';
        document.getElementById('end-facility-select').value = '';
    };

    // 起点のモード切替
    const startAddressBtn = document.getElementById('start-mode-address');
    const startFacilityBtn = document.getElementById('start-mode-facility');
    const startAddressForm = document.getElementById('start-address-form');
    const startFacilityForm = document.getElementById('start-facility-form');
    
    startAddressBtn.addEventListener('click', () => {
        startAddressBtn.classList.add('active');
        startFacilityBtn.classList.remove('active');
        startAddressForm.classList.remove('hidden');
        startFacilityForm.classList.add('hidden');
        resetStartForms();
    });
    
    startFacilityBtn.addEventListener('click', () => {
        startFacilityBtn.classList.add('active');
        startAddressBtn.classList.remove('active');
        startFacilityForm.classList.remove('hidden');
        startAddressForm.classList.add('hidden');
        resetStartForms();
    });
    
    // 終点のモード切替
    const endAddressBtn = document.getElementById('end-mode-address');
    const endFacilityBtn = document.getElementById('end-mode-facility');
    const endAddressForm = document.getElementById('end-address-form');
    const endFacilityForm = document.getElementById('end-facility-form');
    
    endAddressBtn.addEventListener('click', () => {
        endAddressBtn.classList.add('active');
        endFacilityBtn.classList.remove('active');
        endAddressForm.classList.remove('hidden');
        endFacilityForm.classList.add('hidden');
        resetEndForms();
    });
    
    endFacilityBtn.addEventListener('click', () => {
        endFacilityBtn.classList.add('active');
        endAddressBtn.classList.remove('active');
        endFacilityForm.classList.remove('hidden');
        endAddressForm.classList.add('hidden');
        resetEndForms();
    });
}

function initializeApp() {
    console.log('[初期化] アプリケーションを初期化します');
    
    // 施設セレクトボックスの設定
    populateFacilitySelect('start-facility-select');
    populateFacilitySelect('end-facility-select');
    
    // オートコンプリートのセットアップ
    setupDatalist();

    // イベントリスナーのセットアップ（Enterキー、リセット）
    setupInputListeners();
    
    // モード切替の設定
    setupModeSwitchers();
    
    console.log('[初期化完了] アプリケーションの準備ができました');
}

window.onload = initializeApp;
