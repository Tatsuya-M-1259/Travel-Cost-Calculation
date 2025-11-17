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
    
    // 「番地」「番」「号」を統一的にピリオドに変換（順序重要）
    cleanStr = cleanStr.replace(/番地/g, '.');
    cleanStr = cleanStr.replace(/番/g, '.');
    cleanStr = cleanStr.replace(/号/g, '.');
    cleanStr = cleanStr.replace(/の/g, '.');
    
    // ハイフンもピリオドに変換
    cleanStr = cleanStr.replace(/[-]/g, '.');
    
    // 余分な文字を削除（数字とピリオドのみ残す）
    cleanStr = cleanStr.replace(/[^0-9.]/g, '');
    
    // 複数のピリオドを整理（最初の1つまたは2つまで残す）
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
