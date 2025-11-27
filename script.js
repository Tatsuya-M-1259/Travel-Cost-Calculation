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
 */
function parseAddress(fullAddress) {
    let addressBody = fullAddress;
    
    // "天草市"があればそこで分割、なければ全体を対象
    if (fullAddress.includes('天草市')) {
        addressBody = fullAddress.split('天草市')[1];
    }
    
    addressBody = addressBody.trim();
    
    // 数字（半角/全角）が最初に出現する位置を探す
    const match = addressBody.match(/^([^0-9０-９]+)([\d０-９]+.*)$/);
    
    if (match && match[1] && match[2]) {
        return { 
            townName: match[1].trim(), 
            houseNumber: match[2].trim() 
        };
    } else {
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
        
        // 1. データ内で町名を探す
        let targetEntry = null;
        
        // 正規化
        const cleanTownName = normalizedTownName
            .replace(/[Ａ-Ｚａ-ｚ０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
            .replace(/熊本県/g, '')
            .replace(/天草市/g, '')
            .replace(/\s+/g, '');

        const isMatch = (dataTown) => {
            const cleanData = dataTown.replace(/\s+/g, '');
            // A. 完全一致
            if (cleanData === cleanTownName) return true;
            // B. 末尾の"町"を除いた一致
            if (cleanData.replace(/町$/, '') === cleanTownName) return true;
            // C. 旧町名を含んだデータに対し、字名のみでの入力に対応
            const oldTowns = [
                '本渡町', '牛深町', '有明町', '御所浦町', '倉岳町', '栖本町', '新和町', '五和町', '天草町', '河浦町',
                '亀場町', '枦宇土町', '楠浦町', '佐伊津町', '本町', '志柿町', '下浦町', '宮地岳町', '二浦町', '深海町', '久玉町', '魚貫町'
            ];
            for (const old of oldTowns) {
                if (cleanData.startsWith(old)) {
                    const subName = cleanData.replace(old, '');
                    if (subName === cleanTownName) return true;
                }
            }
            return false;
        };

        targetEntry = TRAVEL_POINTS_DATA.find(entry => isMatch(entry.town));
        
        // 2. 特例ルールの適用
        if (!targetEntry) {
            const specialTowns = ['東町', '浄南町', '太田町'];
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
            return {
                error: true,
                point: null,
                message: `町名「${normalizedTownName}」に該当するデータが見つかりません。正しい町名を入力してください（例：五和町御領）。`
            };
        }

        // 3. 範囲を順番にチェック
        for (let i = 0; i < targetEntry.ranges.length; i++) {
            const range = targetEntry.ranges[i];
            const rangeStart = range.start;
            const rangeEnd = range.end;
            
            const inRange = (numericHouseNumber >= rangeStart) && 
                           (rangeEnd >= 99999 || numericHouseNumber < rangeEnd);
            
            if (inRange) {
                return { error: false, point: range.location, message: null };
            }
        }
        
        return {
            error: true,
            point: null,
            message: `地番「${numericHouseNumber}」の範囲を特定できませんでした。データ範囲: ${targetEntry.ranges.map(r => `${r.start}-${r.end}`).join(', ')}`
        };
        
    } catch (e) {
        console.error("検索処理中にエラー:", e);
        return { error: true, point: null, message: `検索処理中に例外が発生しました。(${e.message})` };
    }
}

/**
 * 2つの地点間の旅費を計算する
 */
function calculateTravelCost(startRes, endRes) {
    // 1. 地点特定の成否チェック
    if (startRes.error) return { error: true, message: `起点エラー: ${startRes.message}` };
    if (endRes.error) return { error: true, message: `終点エラー: ${endRes.message}` };

    const startPoint = startRes.point;
    const endPoint = endRes.point;

    console.log(`[旅費計算] ${startPoint} → ${endPoint}`);

    // ORを含む場合の処理
    const startPoints = startPoint.split(/\s+or\s+|OR/).map(p => p.trim());
    const endPoints = endPoint.split(/\s+or\s+|OR/).map(p => p.trim());
    const actualStart = startPoints[0];
    const actualEnd = endPoints[0];

    // 2. 計算対象外地点のチェック
    const isShipOnly = (point) => point.includes("船のみ");
    if (isShipOnly(actualStart) || isShipOnly(actualEnd)) {
        return {
            error: true,
            message: `地点「${isShipOnly(actualStart) ? actualStart : actualEnd}」は船移動が必要なため、このアプリでは旅費算定の対象外です。`
        };
    }
    
    // 3. 旅費データの取得
    if (TRAVEL_MATRIX[actualStart] && TRAVEL_MATRIX[actualStart][actualEnd]) {
        const data = TRAVEL_MATRIX[actualStart][actualEnd];
        return {
            error: false,
            distance: data.distance,
            amount: data.amount,
            isAmbiguous: startPoints.length > 1 || endPoints.length > 1,
            startPoint: startPoint,
            endPoint: endPoint,
            actualStart: actualStart,
            actualEnd: actualEnd
        };
    } else {
        // エラーメッセージ生成
        const isStartMain = MAIN_AREA_POINTS.includes(actualStart);
        const isEndMain = MAIN_AREA_POINTS.includes(actualEnd);
        const isStartGoshoura = GOSHOURA_POINTS.includes(actualStart);
        const isEndGoshoura = GOSHOURA_POINTS.includes(actualEnd);

        let errorMsg = `地点「${actualStart}」から「${actualEnd}」への旅費データが見つかりません。`;

        if ((isStartMain && isEndGoshoura) || (isStartGoshoura && isEndMain)) {
            errorMsg += "\n（本土側と御所浦島内を跨ぐ移動は、船移動が含まれるため別途規定を確認してください。）";
        } else {
            errorMsg += "データが未登録の可能性があります。";
        }

        return { error: true, message: errorMsg };
    }
}

// --- UI操作関数 ---

// バリデーションエラーの表示
function showValidationError(message, focusElementId) {
    const resultArea = document.getElementById('result-area');
    const costDisplay = document.getElementById('travel-cost-display');
    const noteDisplay = document.getElementById('note-display');
    const segmentDisplay = document.getElementById('travel-segment-display');
    const inputDisplay = document.getElementById('search-input-display');

    segmentDisplay.textContent = '---';
    inputDisplay.textContent = '---';
    
    resultArea.style.borderColor = '#dc3545';
    resultArea.style.backgroundColor = '#f8d7da';
    costDisplay.textContent = '入力エラー';
    costDisplay.style.color = '#dc3545';
    noteDisplay.textContent = `※ ${message}`;
    
    resultArea.scrollIntoView({ behavior: 'smooth', block: 'center' });

    if (focusElementId) {
        const element = document.getElementById(focusElementId);
        if(element) {
            element.classList.add('input-error');
            element.focus();
            element.addEventListener('blur', function removeError() {
                element.classList.remove('input-error');
                element.removeEventListener('blur', removeError);
            });
        }
    }
}

// 結果表示（XSS対策済み）
function displayResult(startInput, endInput, costData) {
    const resultArea = document.getElementById('result-area');
    const segmentDisplay = document.getElementById('travel-segment-display');
    const inputDisplay = document.getElementById('search-input-display');
    const costDisplay = document.getElementById('travel-cost-display');
    const noteDisplay = document.getElementById('note-display');
    
    // 初期スタイルリセット
    resultArea.style.borderColor = '#28a745';
    resultArea.style.backgroundColor = '#d4edda';
    costDisplay.style.color = '#28a745';
    noteDisplay.textContent = '※ 特定された地点間の旅費が算定されました。往復金額は片道金額の2倍です。';

    // エラー処理
    if (costData.error) {
        resultArea.style.borderColor = '#dc3545';
        resultArea.style.backgroundColor = '#f8d7da';
        segmentDisplay.textContent = '---';
        inputDisplay.textContent = '---';
        costDisplay.textContent = '算出不可';
        costDisplay.style.color = '#dc3545';
        noteDisplay.textContent = `※ ${costData.message}`;
        return;
    }

    // 安全なDOM構築
    segmentDisplay.textContent = `${costData.startPoint} → ${costData.endPoint}`;
    
    inputDisplay.textContent = ''; // クリア
    
    const appendLine = (label, text) => {
        const strong = document.createElement('strong');
        strong.textContent = label;
        inputDisplay.appendChild(strong);
        
        const lines = text.split('\n');
        lines.forEach((line, idx) => {
            if (idx > 0) inputDisplay.appendChild(document.createElement('br'));
            inputDisplay.appendChild(document.createTextNode(line));
        });
    };

    appendLine('起点: ', startInput);
    inputDisplay.appendChild(document.createElement('br'));
    appendLine('終点: ', endInput);

    // 結果表示
    costDisplay.textContent = `${costData.amount}円 / ${costData.distance}km`;
    
    if (costData.isAmbiguous) {
        resultArea.style.borderColor = '#ffc107';
        resultArea.style.backgroundColor = '#fff3cd';
        costDisplay.style.color = '#d9534f';
        noteDisplay.textContent = `※ 「or」を含む結果は、旅費規定に基づきいずれかの地点を適用してください。実際の計算: ${costData.actualStart} → ${costData.actualEnd}`;
    }
}

function searchTravelCost() {
    console.log('[検索開始]');
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

    // 起点の取得
    let startRes, startInput;
    const startMode = document.getElementById('start-mode-address').classList.contains('active') ? 'address' : 'facility';
    
    if (startMode === 'address') {
        const town = document.getElementById('start-town-name').value.trim();
        const numStr = document.getElementById('start-house-number').value.trim();
        
        if (!town) return showValidationError('起点の町名を入力してください。', 'start-town-name');
        if (!numStr) return showValidationError('起点の地番を入力してください。', 'start-house-number');
        
        const num = parseToNumeric(numStr);
        if (num === 0 && numStr !== '0') return showValidationError('起点の地番の形式が正しくありません。', 'start-house-number');
        
        startRes = getTravelPoint(town, num);
        startInput = `住所: ${town} ${numStr}`;
        
    } else {
        const name = document.getElementById('start-facility-select').value;
        if (!name) return showValidationError('起点の施設を選択してください。', 'start-facility-select');
        
        const facility = FACILITY_DATA.find(f => f.name === name);
        if (!facility) return showValidationError('起点の施設データが見つかりません。', 'start-facility-select');
        
        const parts = parseAddress(facility.address);
        const num = parseToNumeric(parts.houseNumber);
        startRes = getTravelPoint(parts.townName, num);
        startInput = `施設: ${name}\n住所: ${facility.address}`;
    }
    
    // 終点の取得
    let endRes, endInput;
    const endMode = document.getElementById('end-mode-address').classList.contains('active') ? 'address' : 'facility';
    
    if (endMode === 'address') {
        const town = document.getElementById('end-town-name').value.trim();
        const numStr = document.getElementById('end-house-number').value.trim();
        
        if (!town) return showValidationError('終点の町名を入力してください。', 'end-town-name');
        if (!numStr) return showValidationError('終点の地番を入力してください。', 'end-house-number');
        
        const num = parseToNumeric(numStr);
        if (num === 0 && numStr !== '0') return showValidationError('終点の地番の形式が正しくありません。', 'end-house-number');
        
        endRes = getTravelPoint(town, num);
        endInput = `住所: ${town} ${numStr}`;
        
    } else {
        const name = document.getElementById('end-facility-select').value;
        if (!name) return showValidationError('終点の施設を選択してください。', 'end-facility-select');
        
        const facility = FACILITY_DATA.find(f => f.name === name);
        if (!facility) return showValidationError('終点の施設データが見つかりません。', 'end-facility-select');
        
        const parts = parseAddress(facility.address);
        const num = parseToNumeric(parts.houseNumber);
        endRes = getTravelPoint(parts.townName, num);
        endInput = `施設: ${name}\n住所: ${facility.address}`;
    }
    
    const costData = calculateTravelCost(startRes, endRes);
    displayResult(startInput, endInput, costData);

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
        const key = facility.name;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueFacilities.push(facility);
        }
    });

    const sortedFacilities = uniqueFacilities.sort((a, b) => {
        const typeA = getFacilityType(a.name);
        const typeB = getFacilityType(b.name);
        if (typeA !== typeB) return typeA - typeB; 
        return a.name.localeCompare(b.name, 'ja'); 
    });

    sortedFacilities.forEach(facility => {
        const option = document.createElement('option');
        option.value = facility.name;
        option.textContent = facility.name;
        select.appendChild(option);
    });
}

function setupDatalist() {
    const townList = document.getElementById('town-list');
    if (!townList) return;

    TRAVEL_POINTS_DATA.forEach(entry => {
        if (!entry.town.includes('以外')) {
            const option = document.createElement('option');
            option.value = entry.town;
            townList.appendChild(option);
        }
    });
}

function setupInputListeners() {
    const inputs = document.querySelectorAll('input, select');
    const resultArea = document.getElementById('result-area');
    
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            document.getElementById('travel-segment-display').textContent = '---';
            document.getElementById('search-input-display').textContent = '---';
            document.getElementById('travel-cost-display').textContent = '---';
            resultArea.style.backgroundColor = '#e9f7ff'; 
            resultArea.style.borderColor = '#28a745'; 
            document.getElementById('note-display').textContent = '※ 条件を変更した場合は再度「旅費を検索」ボタンを押してください。';
            
            input.classList.remove('input-error');
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                input.blur();
                searchTravelCost();
            }
        });
    });

    const searchBtn = document.getElementById('search-execute-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', searchTravelCost);
    }
}

function setupModeSwitchers() {
    const resetForms = (prefix) => {
        document.getElementById(`${prefix}-town-name`).value = '';
        document.getElementById(`${prefix}-house-number`).value = '';
        document.getElementById(`${prefix}-facility-select`).value = '';
    };

    const setupSwitcher = (prefix) => {
        const addrBtn = document.getElementById(`${prefix}-mode-address`);
        const facilBtn = document.getElementById(`${prefix}-mode-facility`);
        const addrForm = document.getElementById(`${prefix}-address-form`);
        const facilForm = document.getElementById(`${prefix}-facility-form`);

        addrBtn.addEventListener('click', () => {
            addrBtn.classList.add('active');
            facilBtn.classList.remove('active');
            addrForm.classList.remove('hidden');
            facilForm.classList.add('hidden');
            resetForms(prefix);
            document.getElementById(`${prefix}-town-name`).focus();
        });

        facilBtn.addEventListener('click', () => {
            facilBtn.classList.add('active');
            addrBtn.classList.remove('active');
            facilForm.classList.remove('hidden');
            addrForm.classList.add('hidden');
            resetForms(prefix);
            document.getElementById(`${prefix}-facility-select`).focus();
        });
    };

    setupSwitcher('start');
    setupSwitcher('end');
}

function initializeApp() {
    console.log('[初期化] アプリケーションを初期化します');
    populateFacilitySelect('start-facility-select');
    populateFacilitySelect('end-facility-select');
    setupDatalist();
    setupInputListeners();
    setupModeSwitchers();
    console.log('[初期化完了]');
}

window.onload = initializeApp;

// ServiceWorker登録
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}
