// 全地点リスト (53地点)
const ALL_POINTS = [
    "本渡", "佐伊津", "本町", "亀場", "枦宇土", "楠浦", "宮地岳", "志柿", "下浦", 
    "牛深", "魚貫", "亀浦", "久玉", "山の浦", "深海", "魚貫崎", "赤崎", "大浦", 
    "楠甫", "上津浦", "島子", "棚底", "宮田", "浦", "馬場", "河内", "小宮地", 
    "大多尾", "中田", "立", "御領", "鬼池", "二江", "手野", "城河原", "高浜", 
    "大江", "下田", "福連木", "向辺田", "河浦", "崎津", "新合", "板之河内", 
    "古江", "宮野河内", // メインエリア (46地点)
    "御所浦", "椛の木", "長浦", "牧本", "嵐口", "外平", "大浦(御所浦)", "元浦" // 御所浦島内 (8地点, 大浦は区別のためリネーム)
];

// メインエリアの地点リスト (46地点)
const MAIN_AREA_POINTS = [
    "本渡", "佐伊津", "本町", "亀場", "枦宇土", "楠浦", "宮地岳", "志柿", "下浦", 
    "牛深", "魚貫", "亀浦", "久玉", "山の浦", "深海", "魚貫崎", "赤崎", "大浦", 
    "楠甫", "上津浦", "島子", "棚底", "宮田", "浦", "馬場", "河内", "小宮地", 
    "大多尾", "中田", "立", "御領", "鬼池", "二江", "手野", "城河原", "高浜", 
    "大江", "下田", "福連木", "向辺田", "河浦", "崎津", "新合", "板之河内", 
    "古江", "宮野河内"
];

// 御所浦島内の地点リスト (8地点)
const GOSHOURA_POINTS = [
    "御所浦", "椛の木", "長浦", "牧本", "嵐口", "外平", "大浦(御所浦)", "元浦"
];


// --- 旅費の距離・金額データ (旅費の距離・金額.csv から抽出/全パターン対応) ---
// TRAVEL_MATRIX[起点地点][終点地点] = {distance: X, amount: Y}
const TRAVEL_MATRIX = {
    // --------------------------------------------------------------------
    // I. メインエリア 46x46 マトリクス (本渡, 佐伊津, ..., 宮野河内)
    // --------------------------------------------------------------------
    "本渡": {
        "本渡": { "distance": 0.0, "amount": 0 }, "佐伊津": { "distance": 4.7, "amount": 360 }, "本町": { "distance": 6.7, "amount": 500 }, "亀場": { "distance": 2.0, "amount": 260 }, "枦宇土": { "distance": 6.0, "amount": 500 }, "楠浦": { "distance": 5.8, "amount": 420 }, "宮地岳": { "distance": 16.0, "amount": 1060 }, "志柿": { "distance": 6.1, "amount": 500 }, "下浦": { "distance": 7.6, "amount": 560 }, "牛深": { "distance": 44.4, "amount": 2380 }, "魚貫": { "distance": 41.7, "amount": 2260 }, "亀浦": { "distance": 35.9, "amount": 2000 }, "久玉": { "distance": 41.0, "amount": 2260 }, "山の浦": { "distance": 41.8, "amount": 2260 }, "深海": { "distance": 38.5, "amount": 2120 }, "魚貫崎": { "distance": 43.9, "amount": 2340 }, "赤崎": { "distance": 16.6, "amount": 1060 }, "大浦": { "distance": 22.5, "amount": 1380 }, "楠甫": { "distance": 25.9, "amount": 1540 }, "上津浦": { "distance": 13.2, "amount": 900 }, "島子": { "distance": 9.0, "amount": 680 }, "棚底": { "distance": 20.0, "amount": 1280 }, "宮田": { "distance": 15.9, "amount": 1020 }, "浦": { "distance": 22.9, "amount": 1380 }, "馬場": { "distance": 11.7, "amount": 800 }, "河内": { "distance": 16.5, "amount": 1060 }, "小宮地": { "distance": 12.5, "amount": 840 }, "大多尾": { "distance": 14.8, "amount": 960 }, "中田": { "distance": 18.6, "amount": 1180 }, "立": { "distance": 18.8, "amount": 1180 }, "御領": { "distance": 7.1, "amount": 560 }, "鬼池": { "distance": 11.6, "amount": 800 }, "二江": { "distance": 14.1, "amount": 960 }, "手野": { "distance": 9.5, "amount": 680 }, "城河原": { "distance": 7.1, "amount": 560 }, "高浜": { "distance": 31.9, "amount": 1820 }, "大江": { "distance": 38.1, "amount": 2120 }, "下田": { "distance": 25.7, "amount": 1540 }, "福連木": { "distance": 16.7, "amount": 1060 }, "向辺田": { "distance": 40.7, "amount": 2220 }, "河浦": { "distance": 29.0, "amount": 1740 }, "崎津": { "distance": 35.7, "amount": 2000 }, "新合": { "distance": 22.6, "amount": 1380 }, "板之河内": { "distance": 24.0, "amount": 1480 }, "古江": { "distance": 31.0, "amount": 1820 }, "宮野河内": { "distance": 25.6, "amount": 1540 }
    },
    "佐伊津": {
        "本渡": { "distance": 4.7, "amount": 360 }, "佐伊津": { "distance": 0.0, "amount": 0 }, "本町": { "distance": 8.6, "amount": 620 }, "亀場": { "distance": 6.7, "amount": 500 }, "枦宇土": { "distance": 10.5, "amount": 740 }, "楠浦": { "distance": 10.5, "amount": 740 }, "宮地岳": { "distance": 20.5, "amount": 1280 }, "志柿": { "distance": 10.8, "amount": 740 }, "下浦": { "distance": 12.3, "amount": 840 }, "牛深": { "distance": 48.9, "amount": 2560 }, "魚貫": { "distance": 46.2, "amount": 2460 }, "亀浦": { "distance": 40.4, "amount": 2220 }, "久玉": { "distance": 45.5, "amount": 2420 }, "山の浦": { "distance": 46.3, "amount": 2460 }, "深海": { "distance": 43.0, "amount": 2340 }, "魚貫崎": { "distance": 48.4, "amount": 2560 }, "赤崎": { "distance": 21.3, "amount": 1340 }, "大浦": { "distance": 27.2, "amount": 1640 }, "楠甫": { "distance": 30.6, "amount": 1780 }, "上津浦": { "distance": 17.9, "amount": 1120 }, "島子": { "distance": 13.7, "amount": 900 }, "棚底": { "distance": 24.7, "amount": 1480 }, "宮田": { "distance": 20.6, "amount": 1280 }, "浦": { "distance": 27.6, "amount": 1640 }, "馬場": { "distance": 16.4, "amount": 1060 }, "河内": { "distance": 21.2, "amount": 1340 }, "小宮地": { "distance": 17.2, "amount": 1120 }, "大多尾": { "distance": 19.5, "amount": 1240 }, "中田": { "distance": 23.3, "amount": 1440 }, "立": { "distance": 23.5, "amount": 1440 }, "御領": { "distance": 2.4, "amount": 260 }, "鬼池": { "distance": 6.9, "amount": 500 }, "二江": { "distance": 11.0, "amount": 800 }, "手野": { "distance": 6.7, "amount": 500 }, "城河原": { "distance": 7.0, "amount": 560 }, "高浜": { "distance": 36.4, "amount": 2040 }, "大江": { "distance": 42.6, "amount": 2300 }, "下田": { "distance": 30.2, "amount": 1780 }, "福連木": { "distance": 21.2, "amount": 1340 }, "向辺田": { "distance": 45.2, "amount": 2420 }, "河浦": { "distance": 33.5, "amount": 1900 }, "崎津": { "distance": 40.2, "amount": 2220 }, "新合": { "distance": 27.1, "amount": 1640 }, "板之河内": { "distance": 28.5, "amount": 1680 }, "古江": { "distance": 35.5, "amount": 2000 }, "宮野河内": { "distance": 30.3, "amount": 1780 }
    },
    "本町": {
        "本渡": { "distance": 6.7, "amount": 500 }, "佐伊津": { "distance": 8.6, "amount": 620 }, "本町": { "distance": 0.0, "amount": 0 }, "亀場": { "distance": 8.7, "amount": 620 }, "枦宇土": { "distance": 12.5, "amount": 840 }, "楠浦": { "distance": 12.5, "amount": 840 }, "宮地岳": { "distance": 22.5, "amount": 1380 }, "志柿": { "distance": 12.8, "amount": 840 }, "下浦": { "distance": 14.3, "amount": 960 }, "牛深": { "distance": 50.9, "amount": 2640 }, "魚貫": { "distance": 48.2, "amount": 2560 }, "亀浦": { "distance": 42.4, "amount": 2300 }, "久玉": { "distance": 47.5, "amount": 2520 }, "山の浦": { "distance": 48.3, "amount": 2560 }, "深海": { "distance": 45.0, "amount": 2420 }, "魚貫崎": { "distance": 50.4, "amount": 2640 }, "赤崎": { "distance": 23.3, "amount": 1440 }, "大浦": { "distance": 29.2, "amount": 1740 }, "楠甫": { "distance": 32.6, "amount": 1860 }, "上津浦": { "distance": 19.9, "amount": 1240 }, "島子": { "distance": 15.7, "amount": 1020 }, "棚底": { "distance": 26.7, "amount": 1580 }, "宮田": { "distance": 22.6, "amount": 1380 }, "浦": { "distance": 29.6, "amount": 1740 }, "馬場": { "distance": 18.4, "amount": 1180 }, "河内": { "distance": 23.2, "amount": 1440 }, "小宮地": { "distance": 19.2, "amount": 1240 }, "大多尾": { "distance": 21.5, "amount": 1340 }, "中田": { "distance": 25.3, "amount": 1540 }, "立": { "distance": 25.5, "amount": 1540 }, "御領": { "distance": 11.1, "amount": 800 }, "鬼池": { "distance": 15.6, "amount": 1020 }, "二江": { "distance": 13.7, "amount": 900 }, "手野": { "distance": 9.1, "amount": 680 }, "城河原": { "distance": 6.7, "amount": 500 }, "高浜": { "distance": 27.3, "amount": 1640 }, "大江": { "distance": 33.7, "amount": 1900 }, "下田": { "distance": 21.0, "amount": 1340 }, "福連木": { "distance": 12.0, "amount": 840 }, "向辺田": { "distance": 47.2, "amount": 2520 }, "河浦": { "distance": 35.5, "amount": 2000 }, "崎津": { "distance": 42.2, "amount": 2300 }, "新合": { "distance": 29.2, "amount": 1740 }, "板之河内": { "distance": 30.5, "amount": 1780 }, "古江": { "distance": 37.5, "amount": 2080 }, "宮野河内": { "distance": 32.3, "amount": 1860 }
    },
    "亀場": {
        "本渡": { "distance": 2.0, "amount": 260 }, "佐伊津": { "distance": 6.7, "amount": 500 }, "本町": { "distance": 8.7, "amount": 620 }, "亀場": { "distance": 0.0, "amount": 0 }, "枦宇土": { "distance": 5.3, "amount": 420 }, "楠浦": { "distance": 3.8, "amount": 300 }, "宮地岳": { "distance": 15.3, "amount": 1020 }, "志柿": { "distance": 4.9, "amount": 360 }, "下浦": { "distance": 6.4, "amount": 500 }, "牛深": { "distance": 43.7, "amount": 2340 }, "魚貫": { "distance": 41.0, "amount": 2260 }, "亀浦": { "distance": 35.2, "amount": 2000 }, "久玉": { "distance": 40.3, "amount": 2220 }, "山の浦": { "distance": 41.1, "amount": 2260 }, "深海": { "distance": 37.8, "amount": 2080 }, "魚貫崎": { "distance": 43.2, "amount": 2340 }, "赤崎": { "distance": 15.4, "amount": 1020 }, "大浦": { "distance": 21.3, "amount": 1340 }, "楠甫": { "distance": 24.7, "amount": 1480 }, "上津浦": { "distance": 12.0, "amount": 840 }, "島子": { "distance": 7.8, "amount": 560 }, "棚底": { "distance": 18.8, "amount": 1180 }, "宮田": { "distance": 14.7, "amount": 960 }, "浦": { "distance": 21.7, "amount": 1340 }, "馬場": { "distance": 10.5, "amount": 740 }, "河内": { "distance": 15.3, "amount": 1020 }, "小宮地": { "distance": 10.5, "amount": 740 }, "大多尾": { "distance": 12.8, "amount": 840 }, "中田": { "distance": 16.6, "amount": 1060 }, "立": { "distance": 16.8, "amount": 1060 }, "御領": { "distance": 9.1, "amount": 680 }, "鬼池": { "distance": 13.6, "amount": 900 }, "二江": { "distance": 16.1, "amount": 1060 }, "手野": { "distance": 11.5, "amount": 800 }, "城河原": { "distance": 9.1, "amount": 680 }, "高浜": { "distance": 31.3, "amount": 1820 }, "大江": { "distance": 37.5, "amount": 2080 }, "下田": { "distance": 25.1, "amount": 1540 }, "福連木": { "distance": 16.1, "amount": 1060 }, "向辺田": { "distance": 40.0, "amount": 2220 }, "河浦": { "distance": 28.3, "amount": 1680 }, "崎津": { "distance": 35.0, "amount": 2000 }, "新合": { "distance": 22.0, "amount": 1380 }, "板之河内": { "distance": 23.3, "amount": 1440 }, "古江": { "distance": 30.3, "amount": 1780 }, "宮野河内": { "distance": 23.6, "amount": 1440 }
    },
    "枦宇土": {
        "本渡": { "distance": 6.0, "amount": 500 }, "佐伊津": { "distance": 10.5, "amount": 740 }, "本町": { "distance": 12.5, "amount": 840 }, "亀場": { "distance": 5.3, "amount": 420 }, "枦宇土": { "distance": 0.0, "amount": 0 }, "楠浦": { "distance": 6.7, "amount": 500 }, "宮地岳": { "distance": 10.0, "amount": 740 }, "志柿": { "distance": 9.3, "amount": 680 }, "下浦": { "distance": 10.8, "amount": 740 }, "牛深": { "distance": 38.4, "amount": 2120 }, "魚貫": { "distance": 35.7, "amount": 2000 }, "亀浦": { "distance": 29.9, "amount": 1740 }, "久玉": { "distance": 35.0, "amount": 2000 }, "山の浦": { "distance": 35.8, "amount": 2000 }, "深海": { "distance": 32.5, "amount": 1860 }, "魚貫崎": { "distance": 37.9, "amount": 2080 }, "赤崎": { "distance": 19.9, "amount": 1240 }, "大浦": { "distance": 25.8, "amount": 1540 }, "楠甫": { "distance": 29.2, "amount": 1740 }, "上津浦": { "distance": 16.5, "amount": 1060 }, "島子": { "distance": 12.3, "amount": 840 }, "棚底": { "distance": 23.3, "amount": 1440 }, "宮田": { "distance": 19.2, "amount": 1240 }, "浦": { "distance": 26.2, "amount": 1580 }, "馬場": { "distance": 15.0, "amount": 1020 }, "河内": { "distance": 19.8, "amount": 1240 }, "小宮地": { "distance": 13.4, "amount": 900 }, "大多尾": { "distance": 15.7, "amount": 1020 }, "中田": { "distance": 19.5, "amount": 1240 }, "立": { "distance": 19.7, "amount": 1240 }, "御領": { "distance": 13.0, "amount": 900 }, "鬼池": { "distance": 17.5, "amount": 1120 }, "二江": { "distance": 20.0, "amount": 1280 }, "手野": { "distance": 15.4, "amount": 1020 }, "城河原": { "distance": 13.0, "amount": 900 }, "高浜": { "distance": 25.9, "amount": 1540 }, "大江": { "distance": 32.1, "amount": 1860 }, "下田": { "distance": 19.7, "amount": 1240 }, "福連木": { "distance": 10.7, "amount": 740 }, "向辺田": { "distance": 34.7, "amount": 1960 }, "河浦": { "distance": 23.0, "amount": 1440 }, "崎津": { "distance": 29.7, "amount": 1740 }, "新合": { "distance": 16.7, "amount": 1060 }, "板之河内": { "distance": 18.0, "amount": 1180 }, "古江": { "distance": 25.0, "amount": 1540 }, "宮野河内": { "distance": 24.5, "amount": 1480 }
    },
    "楠浦": {
        "本渡": { "distance": 5.8, "amount": 420 }, "佐伊津": { "distance": 10.5, "amount": 740 }, "本町": { "distance": 12.5, "amount": 840 }, "亀場": { "distance": 3.8, "amount": 300 }, "枦宇土": { "distance": 6.7, "amount": 500 }, "楠浦": { "distance": 0.0, "amount": 0 }, "宮地岳": { "distance": 16.7, "amount": 1060 }, "志柿": { "distance": 8.7, "amount": 620 }, "下浦": { "distance": 10.2, "amount": 740 }, "牛深": { "distance": 45.1, "amount": 2420 }, "魚貫": { "distance": 42.4, "amount": 2300 }, "亀浦": { "distance": 36.6, "amount": 2040 }, "久玉": { "distance": 41.7, "amount": 2260 }, "山の浦": { "distance": 37.2, "amount": 2080 }, "深海": { "distance": 29.8, "amount": 1740 }, "魚貫崎": { "distance": 44.6, "amount": 2380 }, "赤崎": { "distance": 19.2, "amount": 1240 }, "大浦": { "distance": 25.1, "amount": 1540 }, "楠甫": { "distance": 28.5, "amount": 1680 }, "上津浦": { "distance": 15.8, "amount": 1020 }, "島子": { "distance": 11.6, "amount": 800 }, "棚底": { "distance": 22.6, "amount": 1380 }, "宮田": { "distance": 18.5, "amount": 1180 }, "浦": { "distance": 25.5, "amount": 1540 }, "馬場": { "distance": 14.3, "amount": 960 }, "河内": { "distance": 19.1, "amount": 1240 }, "小宮地": { "distance": 7.9, "amount": 560 }, "大多尾": { "distance": 10.2, "amount": 740 }, "中田": { "distance": 14.0, "amount": 960 }, "立": { "distance": 14.2, "amount": 960 }, "御領": { "distance": 12.9, "amount": 840 }, "鬼池": { "distance": 17.4, "amount": 1120 }, "二江": { "distance": 19.9, "amount": 1240 }, "手野": { "distance": 15.3, "amount": 1020 }, "城河原": { "distance": 12.9, "amount": 840 }, "高浜": { "distance": 32.6, "amount": 1860 }, "大江": { "distance": 38.8, "amount": 2120 }, "下田": { "distance": 26.4, "amount": 1580 }, "福連木": { "distance": 17.4, "amount": 1120 }, "向辺田": { "distance": 41.4, "amount": 2260 }, "河浦": { "distance": 29.7, "amount": 1740 }, "崎津": { "distance": 36.4, "amount": 2040 }, "新合": { "distance": 23.4, "amount": 1440 }, "板之河内": { "distance": 24.7, "amount": 1480 }, "古江": { "distance": 31.7, "amount": 1820 }, "宮野河内": { "distance": 21.0, "amount": 1340 }
    },
    // ... (以下、全46地点間の距離・金額データが続く)

    // 中略：メインエリアの全地点間のマトリクスデータが続く...

    "宮野河内": {
        "本渡": { "distance": 25.6, "amount": 1540 }, "佐伊津": { "distance": 30.3, "amount": 1780 }, "本町": { "distance": 32.3, "amount": 1860 }, "亀場": { "distance": 23.6, "amount": 1440 }, "枦宇土": { "distance": 24.5, "amount": 1480 }, "楠浦": { "distance": 21.0, "amount": 1340 }, "宮地岳": { "distance": 14.5, "amount": 960 }, "志柿": { "distance": 28.4, "amount": 1680 }, "下浦": { "distance": 29.9, "amount": 1740 }, "牛深": { "distance": 22.7, "amount": 1380 }, "魚貫": { "distance": 22.5, "amount": 1380 }, "亀浦": { "distance": 18.2, "amount": 1180 }, "久玉": { "distance": 19.3, "amount": 1240 }, "山の浦": { "distance": 15.8, "amount": 1020 }, "深海": { "distance": 8.4, "amount": 620 }, "魚貫崎": { "distance": 24.7, "amount": 1480 }, "赤崎": { "distance": 39.0, "amount": 2160 }, "大浦": { "distance": 44.9, "amount": 2380 }, "楠甫": { "distance": 48.3, "amount": 2560 }, "上津浦": { "distance": 35.6, "amount": 2000 }, "島子": { "distance": 31.4, "amount": 1820 }, "棚底": { "distance": 42.4, "amount": 2300 }, "宮田": { "distance": 38.3, "amount": 2120 }, "浦": { "distance": 45.3, "amount": 2420 }, "馬場": { "distance": 34.1, "amount": 1960 }, "河内": { "distance": 38.9, "amount": 2120 }, "小宮地": { "distance": 13.1, "amount": 900 }, "大多尾": { "distance": 17.2, "amount": 1120 }, "中田": { "distance": 7.0, "amount": 560 }, "立": { "distance": 13.3, "amount": 900 }, "御領": { "distance": 32.7, "amount": 1860 }, "鬼池": { "distance": 37.2, "amount": 2080 }, "二江": { "distance": 39.7, "amount": 2160 }, "手野": { "distance": 35.1, "amount": 2000 }, "城河原": { "distance": 32.7, "amount": 1860 }, "高浜": { "distance": 27.0, "amount": 1640 }, "大江": { "distance": 20.8, "amount": 1280 }, "下田": { "distance": 33.0, "amount": 1900 }, "福連木": { "distance": 25.2, "amount": 1540 }, "向辺田": { "distance": 29.9, "amount": 1740 }, "河浦": { "distance": 12.2, "amount": 840 }, "崎津": { "distance": 17.3, "amount": 1120 }, "新合": { "distance": 7.8, "amount": 560 }, "板之河内": { "distance": 15.6, "amount": 1020 }, "古江": { "distance": 15.6, "amount": 1020 }, "宮野河内": { "distance": 0.0, "amount": 0 }
    },
    
    // --------------------------------------------------------------------
    // II. 御所浦島内 8x8 マトリクス (御所浦, 椛の木, ..., 元浦)
    // --------------------------------------------------------------------
    "御所浦": {
        "御所浦": { "distance": 0.0, "amount": 0 }, "椛の木": { "distance": 5.3, "amount": 420 }, "長浦": { "distance": 4.1, "amount": 360 }, "牧本": { "distance": 2.7, "amount": 260 }, "嵐口": { "distance": 2.5, "amount": 260 }, "外平": { "distance": 8.3, "amount": 620 }, "大浦(御所浦)": { "distance": 4.0, "amount": 360 }, "元浦": { "distance": 3.0, "amount": 300 }
    },
    "椛の木": {
        "御所浦": { "distance": 5.3, "amount": 420 }, "椛の木": { "distance": 0.0, "amount": 0 }, "長浦": { "distance": 0.0, "amount": 0 }, "牧本": { "distance": 2.6, "amount": 260 }, "嵐口": { "distance": 6.8, "amount": 500 }, "外平": { "distance": 12.6, "amount": 840 }, "大浦(御所浦)": { "distance": 9.3, "amount": 680 }, "元浦": { "distance": 8.3, "amount": 620 }
    },
    "長浦": {
        "御所浦": { "distance": 4.1, "amount": 360 }, "椛の木": { "distance": 0.0, "amount": 0 }, "長浦": { "distance": 0.0, "amount": 0 }, "牧本": { "distance": 0.0, "amount": 0 }, "嵐口": { "distance": 5.6, "amount": 420 }, "外平": { "distance": 11.4, "amount": 800 }, "大浦(御所浦)": { "distance": 8.1, "amount": 620 }, "元浦": { "distance": 7.1, "amount": 560 }
    },
    "牧本": {
        "御所浦": { "distance": 2.7, "amount": 260 }, "椛の木": { "distance": 2.6, "amount": 260 }, "長浦": { "distance": 0.0, "amount": 0 }, "牧本": { "distance": 0.0, "amount": 0 }, "嵐口": { "distance": 4.2, "amount": 360 }, "外平": { "distance": 10.0, "amount": 740 }, "大浦(御所浦)": { "distance": 6.7, "amount": 500 }, "元浦": { "distance": 5.7, "amount": 420 }
    },
    "嵐口": {
        "御所浦": { "distance": 2.5, "amount": 260 }, "椛の木": { "distance": 6.8, "amount": 500 }, "長浦": { "distance": 5.6, "amount": 420 }, "牧本": { "distance": 4.2, "amount": 360 }, "嵐口": { "distance": 0.0, "amount": 0 }, "外平": { "distance": 5.8, "amount": 420 }, "大浦(御所浦)": { "distance": 6.5, "amount": 500 }, "元浦": { "distance": 5.5, "amount": 420 }
    },
    "外平": {
        "御所浦": { "distance": 8.3, "amount": 620 }, "椛の木": { "distance": 12.6, "amount": 840 }, "長浦": { "distance": 11.4, "amount": 800 }, "牧本": { "distance": 10.0, "amount": 740 }, "嵐口": { "distance": 5.8, "amount": 420 }, "外平": { "distance": 0.0, "amount": 0 }, "大浦(御所浦)": { "distance": 12.3, "amount": 840 }, "元浦": { "distance": 11.3, "amount": 800 }
    },
    "大浦(御所浦)": {
        "御所浦": { "distance": 4.0, "amount": 360 }, "椛の木": { "distance": 9.3, "amount": 680 }, "長浦": { "distance": 8.1, "amount": 620 }, "牧本": { "distance": 6.7, "amount": 500 }, "嵐口": { "distance": 6.5, "amount": 500 }, "外平": { "distance": 12.3, "amount": 840 }, "大浦(御所浦)": { "distance": 0.0, "amount": 0 }, "元浦": { "distance": 0.0, "amount": 0 }
    },
    "元浦": {
        "御所浦": { "distance": 3.0, "amount": 300 }, "椛の木": { "distance": 8.3, "amount": 620 }, "長浦": { "distance": 7.1, "amount": 560 }, "牧本": { "distance": 5.7, "amount": 420 }, "嵐口": { "distance": 5.5, "amount": 420 }, "外平": { "distance": 11.3, "amount": 800 }, "大浦(御所浦)": { "distance": 0.0, "amount": 0 }, "元浦": { "distance": 0.0, "amount": 0 }
    }
    // メインエリアの残り44地点と御所浦島内7地点の全組み合わせは省略していますが、計算ロジックはTRAVEL_MATRIXのキーとして対応可能です。
    // ... (データ量が多いため省略。実際の実装では全データが必要です)

    // 注: CSVに記載がないメインエリア間の組み合わせ（例: 本渡⇔御所浦）は、このマトリクスに含まれていません。
    // それらの地点間の旅費は、別途、市役所にご確認いただくか、このマトリクスを追記する必要があります。
};

// ... (以下、施設データと地点判定データ、ユーティリティ関数が続く)

// --- 施設データ (前回のコードから変更なし) ---
const FACILITY_DATA = [
    {"name": "天草市役所", "address": "天草市東浜町８番１号"},
    {"name": "牛深支所", "address": "天草市牛深町２２８６番地１０３"},
    {"name": "有明支所", "address": "天草市有明町赤崎３３８３番地"},
    {"name": "御所浦支所", "address": "天草市御所浦町御所浦３５２７番地"},
    {"name": "倉岳支所", "address": "天草市倉岳町棚底１９１９番地"},
    {"name": "栖本支所", "address": "天草市栖本町馬場１７９番地"},
    {"name": "新和支所", "address": "天草市新和町小宮地６６９番地１"},
    {"name": "五和支所", "address": "天草市五和町御領２９４３番地"},
    {"name": "天草支所", "address": "天草市天草町高浜南４８８番地１"},
    {"name": "河浦支所", "address": "天草市河浦町河浦５２５３番地"},
    {"name": "天草市新和B＆G海洋センター", "address": "天草市新和町大多尾２１３８番地３"},
    {"name": "地域交流センターおおくす", "address": "天草市五和町手野一丁目３６７番地１"},
    {"name": "天草市複合施設ここらす", "address": "天草市浄南町４番１５号"},
    {"name": "本渡南地区コミュニティセンター", "address": "天草市港町１３番５号"},
    {"name": "本渡北地区コミュニティセンター", "address": "天草市今釜町１０番４３号"},
    {"name": "亀場地区コミュニティセンター", "address": "天草市亀場町亀川１６９８番地"},
    {"name": "枦宇土地区コミュニティセンター", "address": "天草市枦宇土町１７１１番地"},
    {"name": "志柿地区コミュニティセンター", "address": "天草市志柿町３３９０番地１０"},
    {"name": "志柿町瀬戸地区コミュニティセンター", "address": "天草市志柿町６６２３番地１"},
    {"name": "下浦地区コミュニティセンター", "address": "天草市下浦町１２８２番地"},
    {"name": "楠浦地区コミュニティセンター", "address": "天草市楠浦町２３６６番地"},
    {"name": "本町地区コミュニティセンター", "address": "天草市本町本８３２番地"},
    {"name": "佐伊津地区コミュニティセンター", "address": "天草市佐伊津町２２５８番地"},
    {"name": "宮地岳地区コミュニティセンター", "address": "天草市宮地岳町５６１６番地２"},
    {"name": "牛深地区コミュニティセンター", "address": "天草市牛深町１２２番地２"},
    {"name": "久玉地区コミュニティセンター", "address": "天草市久玉町１４１２番地１２"},
    {"name": "魚貫地区コミュニティセンター", "address": "天草市魚貫町２１２９番地"},
    {"name": "深海地区コミュニティセンター", "address": "天草市深海町１８４２番地４２"},
    {"name": "二浦地区コミュニティセンター", "address": "天草市二浦町亀浦１０３５番地１１"},
    {"name": "楠甫地区コミュニティセンター", "address": "天草市有明町楠甫４６２９番地７"},
    {"name": "大浦地区コミュニティセンター", "address": "天草市有明町大浦１７２３番地１"},
    {"name": "須子地区コミュニティセンター", "address": "天草市有明町須子２０８２番地３"},
    {"name": "赤崎地区コミュニティセンター", "address": "天草市有明町赤崎１８０１番地１"},
    {"name": "上津浦地区コミュニティセンター", "address": "天草市有明町上津浦３７０６番地４"},
    {"name": "下津浦地区コミュニティセンター", "address": "天草市有明町下津浦２５０５番地２"},
    {"name": "島子地区コミュニティセンター", "address": "天草市有明町大島子２６６９番地"},
    {"name": "御所浦地区コミュニティセンター", "address": "天草市御所浦町御所浦４３１０番地５"},
    {"name": "御所浦南地区コミュニティセンター", "address": "天草市御所浦町御所浦６１９６番地２"},
    {"name": "牧島地区コミュニティセンター", "address": "天草市御所浦町牧島６２５番地７"},
    {"name": "御所浦北地区コミュニティセンター", "address": "天草市御所浦町横浦３８３番地６"},
    {"name": "嵐口地区コミュニティセンター", "address": "天草市御所浦町御所浦２８９５番地１４"},
    {"name": "浦地区コミュニティセンター", "address": "天草市倉岳町浦３０８９番地１"},
    {"name": "棚底地区コミュニティセンター", "address": "天草市倉岳町棚底１７８６番地４"},
    {"name": "宮田地区コミュニティセンター", "address": "天草市倉岳町宮田１３２７番地１"},
    {"name": "栖本地区コミュニティセンター", "address": "天草市栖本町河内４４１４番地１"},
    {"name": "小宮地地区コミュニティセンター", "address": "天草市新和町小宮地６６９番地１"},
    {"name": "宮南地区コミュニティセンター", "address": "天草市新和町小宮地１０８２１番地１"},
    {"name": "大宮地地区コミュニティセンター", "address": "天草市新和町大宮地４２７５番地１"},
    {"name": "大多尾地区コミュニティセンター", "address": "天草市新和町大多尾２８５２番地１"},
    {"name": "中田地区コミュニティセンター", "address": "天草市新和町中田２２７０番地５"},
    {"name": "碇石地区コミュニティセンター", "address": "天草市新和町碇石９５９番地１"},
    {"name": "御領地区コミュニティセンター", "address": "天草市五和町御領６６９２番地１"},
    {"name": "大島地区コミュニティセンター", "address": "天草市五和町御領９７６１番地"},
    {"name": "鬼池地区コミュニティセンター", "address": "天草市五和町鬼池１１８４番地"},
    {"name": "二江地区コミュニティセンター", "address": "天草市五和町二江３０６６番地"},
    {"name": "手野地区コミュニティセンター", "address": "天草市五和町手野一丁目３７６８番地３"},
    {"name": "城河原地区コミュニティセンター", "address": "天草市五和町城河原一丁目１７番地１"},
    {"name": "福連木地区コミュニティセンター", "address": "天草市天草町福連木３６４５番地２"},
    {"name": "下田北地区コミュニティセンター", "address": "天草市天草町下田北５３４番地１"},
    {"name": "下田南地区コミュニティセンター", "address": "天草市天草町下田南３０４０番地１"},
    {"name": "高浜地区コミュニティセンター", "address": "天草市天草町高浜南５０１番地１"},
    {"name": "大江地区コミュニティセンター", "address": "天草市天草町大江７４８０番地５"},
    {"name": "新合地区コミュニティセンター", "address": "天草市河浦町新合２００８番地４"},
    {"name": "一町田地区コミュニティセンター", "address": "天草市河浦町河浦５２２３番地"},
    {"name": "富津地区コミュニティセンター", "address": "天草市河浦町富津１１１７番地２"},
    {"name": "宮野河内地区コミュニティセンター", "address": "天草市河浦町宮野河内３３７番地６"},
    {"name": "天草市立本渡学校給食センター", "address": "天草市東町７番地４１"},
    {"name": "天草市立牛深学校給食センター", "address": "天草市久玉町１２１６番地１２"},
    {"name": "天草市立御所浦学校給食センター", "address": "天草市御所浦町御所浦３２１５番地４"},
    {"name": "天草市立栖本学校給食センター", "address": "天草市栖本町打田１８番地１"},
    {"name": "天草市立五和学校給食センター", "address": "天草市五和町御領６６８９番地６"},
    {"name": "天草市立天草学校給食センター", "address": "天草市天草町高浜南４８８番地１"},
    {"name": "牛深総合センター", "address": "天草市牛深町１６０番地"},
    {"name": "天草市立本渡南小学校", "address": "天草市川原町４番２１号"},
    {"name": "天草市立本渡北小学校", "address": "天草市浜崎町３番５５号"},
    {"name": "天草市立亀川小学校", "address": "天草市亀場町亀川１６２０番地"},
    {"name": "天草市立本渡東小学校", "address": "天草市志柿町５０２９番地５"},
    {"name": "天草市立楠浦小学校", "address": "天草市楠浦町２８０５番地"},
    {"name": "天草市立本町小学校", "address": "天草市本町本８１５番地"},
    {"name": "天草市立佐伊津小学校", "address": "天草市佐伊津町２３１２番地"},
    {"name": "天草市立牛深小学校", "address": "天草市牛深町１９８５番地"},
    {"name": "天草市立牛深東小学校", "address": "天草市久玉町２３６４番地"},
    {"name": "天草市立有明小学校", "address": "天草市有明町赤崎３２９１番地"},
    {"name": "天草市立御所浦小学校", "address": "天草市御所浦町御所浦３５２７番地５"},
    {"name": "天草市立倉岳小学校", "address": "天草市倉岳町棚底２０９１番地"},
    {"name": "天草市立栖本小学校", "address": "天草市栖本町馬場２５番地"},
    {"name": "天草市立新和小学校", "address": "天草市新和町小宮地６２０番地"},
    {"name": "天草市立五和小学校", "address": "天草市五和町御領９６０８番地１"},
    {"name": "天草市立天草小学校", "address": "天草市天草町高浜南２７１４番地"},
    {"name": "天草市立河浦小学校", "address": "天草市河浦町河浦４９３２番地２"},
    {"name": "天草市立本渡中学校", "address": "天草市本渡町広瀬５番地１１０"},
    {"name": "天草市立本渡東中学校", "address": "天草市志柿町５０３１番地"},
    {"name": "天草市立稜南中学校", "address": "天草市亀場町亀川１４２５番地"},
    {"name": "天草市立牛深中学校", "address": "天草市牛深町１２１１番地２５"},
    {"name": "天草市立牛深東中学校", "address": "天草市久玉町２３６４番地"},
    {"name": "天草市立有明中学校", "address": "天草市有明町赤崎３３８３番地"},
    {"name": "天草市立御所浦中学校", "address": "天草市御所浦町御所浦３２１５番地２"},
    {"name": "天草市立倉岳中学校", "address": "天草市倉岳町棚底２６91番地"},
    {"name": "天草市立栖本中学校", "address": "天草市栖本町湯船原６９０番地４"},
    {"name": "天草市立新和中学校", "address": "天草市新和町小宮地１３０４番地"},
    {"name": "天草市立五和中学校", "address": "天草市五和町御領９６０７番地２"},
    {"name": "天草市立天草中学校", "address": "天草市天草町高浜南４８８番地１"},
    {"name": "天草市立河浦中学校", "address": "天草市河浦町河浦３５番地２４"},
    {"name": "中央生涯学習センター", "address": "天草市浄南町４番１５号"},
    {"name": "生涯学習センター", "address": "天草市久玉町５７１６番地４"},
    {"name": "天草市本町体育館", "address": "天草市本町新休２７番地７"},
    {"name": "天草市佐伊津体育館", "address": "天草市佐伊津町５７９６番地"},
    {"name": "天草市瀬戸体育館", "address": "天草市志柿町６３４８番地"},
    {"name": "天草市金焼体育館", "address": "天草市下浦町９４７５番地"},
    {"name": "天草市枦宇土体育館", "address": "天草市枦宇土町１９０１番地３"},
    {"name": "天草市茂串体育館", "address": "天草市牛深町５99番地"},
    {"name": "天草市天附体育館", "address": "天草市牛深町３２７５番地１１"},
    {"name": "天草市魚貫体育館", "address": "天草市魚貫町１４４３番地"},
    {"name": "天草市深海体育館", "address": "天草市深海町４４６２番地３"},
    {"name": "天草市二浦体育館", "address": "天草市二浦町亀浦４４０３番地８"},
    {"name": "天草市楠甫体育館", "address": "天草市有明町楠甫７５６番地"},
    {"name": "天草市大楠体育館", "address": "天草市有明町大浦５３３番地１"},
    {"name": "天草市須子体育館", "address": "天草市有明町須子１２２６番地２"},
    {"name": "天草市赤崎体育館", "address": "天草市有明町赤崎１７６４番地"},
    {"name": "天草市浦和体育館", "address": "天草市有明町上津浦５５１番地"},
    {"name": "天草市島子体育館", "address": "天草市有明町大島子２６６９番地"},
    {"name": "天草市御所浦北体育館", "address": "天草市御所浦町横浦５３６番地"},
    {"name": "天草市倉岳体育館", "address": "天草市倉岳町棚底２５５６番地"},
    {"name": "天草市浦体育館", "address": "天草市倉岳町浦３０６４番地１"},
    {"name": "天草市宮田体育館", "address": "天草市倉岳町宮田１３２７番地１"},
    {"name": "天草市栖本河内体育館", "address": "天草市栖本町河内４４１７番地１"},
    {"name": "天草市栖本体育館", "address": "天草市栖本町古江１５３番地４"},
    {"name": "天草市新和体育館", "address": "天草市新和町小宮地７２２番地"},
    {"name": "天草市宮南体育館", "address": "天草市新和町小宮地１０８１６番地２"},
    {"name": "天草市大宮地体育館", "address": "天草市新和町大宮地４２７７番地１"},
    {"name": "天草市五和体育館", "address": "天草市五和町御領６８１６番地"},
    {"name": "天草市鬼池体育館", "address": "天草市五和町鬼池１３１０番地"},
    {"name": "天草市手野体育館", "address": "天草市五和町手野一丁目３７６１番地１"},
    {"name": "天草市城河原体育館", "address": "天草市五和町城河原三丁目６９番地"},
    {"name": "天草市福連木体育館", "address": "天草市天草町福連木３５０５番地１"},
    {"name": "天草市天草勤労者体育館", "address": "天草市天草町高浜南４７２番地３"},
    {"name": "天草市河浦中央体育館", "address": "天草市河浦町白木河内１７５番地４"},
    {"name": "天草市一町田体育館", "address": "天草市河浦町久留２１８番地１"},
    {"name": "天草市新合体育館", "address": "天草市河浦町新合２０１３番地１"},
    {"name": "天草市宮野河内体育館", "address": "天草市河浦町宮野河内１１６１番地１"},
    {"name": "天草市乙女蛇運動広場", "address": "天草市南町１２９５番地"},
    {"name": "天草市山口運動広場", "address": "天草市本渡町本渡３３５５番地"},
    {"name": "天草市亀場運動広場", "address": "天草市亀場町亀川２２３８番地２"},
    {"name": "天草市枦宇土運動広場", "address": "天草市枦宇土町１８００番地"},
    {"name": "天草市志柿運動広場", "address": "天草市志柿町３３９０番地１０"},
    {"name": "天草市瀬戸運動広場", "address": "天草市志柿町６３２５番地５"},
    {"name": "天草市下浦運動広場", "address": "天草市下浦町５１番地"},
    {"name": "天草市下浦運動広場アーチェリー場", "address": "天草市下浦町５１番地"},
    {"name": "天草市錦島運動広場", "address": "天草市楠浦町２３番地１"},
    {"name": "天草市本町運動広場", "address": "天草市本町新休２７番地７"},
    {"name": "天草市佐伊津運動広場", "address": "天草市佐伊津町５７９６番地"},
    {"name": "天草市宮地岳運動広場", "address": "天草市宮地岳町５６３５番地２"},
    {"name": "天草市牛深グラウンド", "address": "天草市牛深町１２１１番地２５"},
    {"name": "天草市天附グラウンド", "address": "天草市牛深町３２７５番地８"},
    {"name": "天草市深海グラウンド", "address": "天草市深海町２８０１番地１４"},
    {"name": "天草市魚浦グラウンド", "address": "天草市二浦町亀浦３４４３番地１"},
    {"name": "天草市楠甫グラウンド", "address": "天草市有明町楠甫４６２９番地１"},
    {"name": "天草市大楠グラウンド", "address": "天草市有明町大浦５３３番地１"},
    {"name": "天草市須子グラウンド", "address": "天草市有明町須子１２２６番地２"},
    {"name": "天草市赤崎グラウンド", "address": "天草市有明町赤崎１７６４番地"},
    {"name": "天草市上津浦グラウンド", "address": "天草市有明町上津浦３６９８番地"},
    {"name": "天草市有明グラウンド", "address": "天草市有明町下津浦３００１番地９"},
    {"name": "天草市島子グラウンド", "address": "天草市有明町大島子２６６９番地"},
    {"name": "天草市倉岳総合グラウンド", "address": "天草市倉岳町棚底２６７６番地１"},
    {"name": "天草市浦グラウンド", "address": "天草市倉岳町浦３０６４番地１"},
    {"name": "天草市宮田グラウンド", "address": "天草市倉岳町宮田１３２７番地１"},
    {"name": "天草市栖本河内グラウンド", "address": "天草市栖本町河内４４１４番地１"},
    {"name": "天草市栖本総合グラウンド", "address": "天草市栖本町古江１５３番地５"},
    {"name": "天草市栖本総合グラウンドテニスコート", "address": "天草市栖本町古江１５３番地５"},
    {"name": "天草市栖本相撲場", "address": "天草市栖本町古江１５３番地５"},
    {"name": "天草市新和グラウンド", "address": "天草市新和町小宮地７１３番地"},
    {"name": "天草市大宮地運動広場", "address": "天草市新和町大宮地４２７７番地１"},
    {"name": "天草市中田運動広場", "address": "天草市新和町中田２２７０番地１１"},
    {"name": "天草市大多尾運動広場", "address": "天草市新和町大多尾３５２０番地１"},
    {"name": "天草市碇石運動広場", "address": "天草市新和町碇石９５７番地１"},
    {"name": "天草市新和相撲場", "address": "天草市新和町碇石９５７番地１"},
    {"name": "天草市五和グラウンド", "address": "天草市五和町御領２９４０番地１"},
    {"name": "天草市五和テニスコート", "address": "天草市五和町御領２９４０番地１"},
    {"name": "天草市鬼池運動広場", "address": "天草市五和町鬼池１２９２番地"},
    {"name": "天草市二江運動広場", "address": "天草市五和町二江３２４２番地１"},
    {"name": "天草市手野運動広場", "address": "天草市五和町手野一丁目３５８８番地１"},
    {"name": "天草市城河原運動広場", "address": "天草市五和町城河原三丁目５０番地"},
    {"name": "天草市下田北運動広場", "address": "天草市天草町下田北１５０１番地"},
    {"name": "天草市天草総合運動公園", "address": "天草市天草町高浜北１６７５番地１"},
    {"name": "天草市天草総合運動公園テニスコート", "address": "天草市天草町高浜北１６７５番地１"},
    {"name": "天草市大江農村広場", "address": "天草市天草町大江１００３番地"},
    {"name": "天草市河浦さざんか公園運動広場", "address": "天草市河浦町新合２１４４番地１"},
    {"name": "天草市河浦総合運動場", "address": "天草市河浦町白木河内１７５番地２１"},
    {"name": "天草市河浦総合運動場テニスコート", "address": "天草市河浦町白木河内１７５番地２１"},
    {"name": "天草市富津運動場", "address": "天草市河浦町崎津１１１７番地４"}, 
    {"name": "天草市宮野河内運動場", "address": "天草市河浦町宮野河内３３７番地６"},
    {"name": "天草市陸上競技場", "address": "天草市本渡町広瀬５番地１１３"},
    {"name": "御所浦交流センター", "address": "天草市御所浦町御所浦５８７５番地２"},
    {"name": "本渡地区公民館", "address": "天草市浄南町４番１５号"},
    {"name": "牛深地区公民館", "address": "天草市牛深町２２８６番地１０３"},
    {"name": "有明地区公民館", "address": "天草市有明町赤崎３３８３番地"},
    {"name": "御所浦地区公民館", "address": "天草市御所浦町御所浦３５２７番地"},
    {"name": "倉岳地区公民館", "address": "天草市倉岳町棚底１９１９番地"},
    {"name": "栖本地区公民館", "address": "天草市栖本町馬場１７９番地"},
    {"name": "新和地区公民館", "address": "天草市新和町小宮地６６９番地１"},
    {"name": "五和地区公民館", "address": "天草市五和町御領２９４３番地"},
    {"name": "天草地区公民館", "address": "天草市天草町高浜南４８８番地１"},
    {"name": "河浦地区公民館", "address": "天草市河浦町河浦５２５３番地"},
    {"name": "天草市今富地域交流施設", "address": "天草市河浦町今富９５６番地"},
    {"name": "天草交流センターブルーアイランド天草", "address": "天草市天草町大江５０４番地２"},
    {"name": "天草市民センター", "address": "天草市東町３番地"},
    {"name": "天草市立御所浦恐竜の島博物館", "address": "天草市御所浦町御所浦４３１０番地５"},
    {"name": "天草市立中央図書館", "address": "天草市浄南町４番１５号"},
    {"name": "天草市立牛深図書館", "address": "天草市牛深町１６０番地"},
    {"name": "天草市立御所浦図書館", "address": "天草市御所浦町御所浦３５２５番地２"},
    {"name": "天草市立河浦図書館", "address": "天草市河浦町河浦５２５３番地"},
    {"name": "天草市立天草アーカイブズ", "address": "天草市志柿町６３３５番地"},
    {"name": "天草市立本渡歴史民俗資料館", "address": "天草市今釜新町３７０６番地"},
    {"name": "天草市立有明歴史民俗資料館", "address": "天草市有明町下津浦３００１番地９"},
    {"name": "天草市立倉岳歴史民俗資料館", "address": "天草市倉岳町棚底１７８６番地４"},
    {"name": "天草市立新和歴史民俗資料館", "address": "天草市新和町小宮地８９１８番地２"},
    {"name": "天草市立五和歴史民俗資料館", "address": "天草市五和町二江３８４番地"},
    {"name": "天草文化交流館", "address": "天草市船之尾町８番２５号"},
    {"name": "天草市立本渡南幼稚園", "address": "天草市川原町４番７号"},
    {"name": "天草市立本渡北幼稚園", "address": "天草市浜崎町４番９号"},
    {"name": "天草市立亀場幼稚園", "address": "天草市亀場町亀川１５３８番地１"},
];

// --- 旅費地点判定データ (前回のコードから変更なし) ---
const TRAVEL_POINTS_DATA = [
    { "town": "東町", "ranges": [{"start": 0.0, "end": 99999.0, "location": "本渡or亀場"}] },
    { "town": "浄南町", "ranges": [
        {"start": 5.0, "end": 99999.0, "location": "本渡or亀場" }, 
        {"start": 0.0, "end": 5.0, "location": "本渡" }
    ]},
    { "town": "太田町", "ranges": [
        {"start": 19.0, "end": 21.0, "location": "本渡or亀場"}, 
        {"start": 0.0, "end": 19.0, "location": "本渡"}, 
        {"start": 21.0, "end": 99999.0, "location": "本渡"}
    ]},
    { "town": "東・浄南・太田町以外", "ranges": [{"start": 0.0, "end": 99999.0, "location": "本渡" }] }, 
    { "town": "旭町", "ranges": [{"start": 0.0, "end": 99999.0, "location": "佐伊津"}] },
    { "town": "瀬戸町", "ranges": [{"start": 0.0, "end": 99999.0, "location": "亀場"}] },
    { "town": "本渡町本渡", "ranges": [{"start": 0.0, "end": 99999.0, "location": "本渡"}] },
    { "town": "本渡町広瀬", "ranges": [
        {"start": 1.0, "end": 1470.0, "location": "本渡"},
        {"start": 1470.0, "end": 2080.0, "location": "佐伊津"}, 
        {"start": 2080.0, "end": 99999.0, "location": "本渡"}
    ]},
    { "town": "本渡町本戸馬場", "ranges": [{"start": 0.0, "end": 99999.0, "location": "本渡"}] },
    { "town": "本渡町本泉", "ranges": [{"start": 0.0, "end": 99999.0, "location": "本渡"}] },
    { "town": "佐伊津町", "ranges": [{"start": 0.0, "end": 99999.0, "location": "佐伊津"}] },
    { "town": "本町本", "ranges": [{"start": 0.0, "end": 99999.0, "location": "本町"}] },
    { "town": "本町新休", "ranges": [{"start": 0.0, "end": 99999.0, "location": "本町"}] },
    { "town": "本町下河内", "ranges": [
        {"start": 1.0, "end": 1200.0, "location": "本町"},
        {"start": 1200.0, "end": 2000.0, "location": "城河原"}, 
        {"start": 2000.0, "end": 99999.0, "location": "本町"}
    ]},
    { "town": "亀場町亀川", "ranges": [{"start": 0.0, "end": 99999.0, "location": "亀場"}] },
    { "town": "亀場町食場", "ranges": [
        {"start": 1.0, "end": 340.0, "location": "枦宇土"},
        {"start": 340.0, "end": 700.0, "location": "亀場"},
        {"start": 700.0, "end": 800.0, "location": "枦宇土"}, 
        {"start": 800.0, "end": 900.0, "location": "亀場or枦宇土"},
        {"start": 900.0, "end": 1200.0, "location": "亀場"},
        {"start": 1200.0, "end": 99999.0, "location": "枦宇土"}
    ]},
    { "town": "枦宇土町", "ranges": [
        {"start": 1.0, "end": 1030.0, "location": "枦宇土 OR 福連木"},
        {"start": 1030.0, "end": 1130.0, "location": "枦宇土 OR 宮地岳"}, 
        {"start": 1130.0, "end": 99999.0, "location": "枦宇土"}
    ]},
    { "town": "楠浦町", "ranges": [
        {"start": 1.0, "end": 900.0, "location": "楠浦"},
        {"start": 900.0, "end": 1200.0, "location": "亀場or楠浦"}, 
        {"start": 1200.0, "end": 6400.0, "location": "楠浦"},
        {"start": 6400.0, "end": 6800.0, "location": "宮地岳"},
        {"start": 6800.0, "end": 10000.0, "location": "楠浦"},
        {"start": 10000.0, "end": 99999.0, "location": "亀場"}
    ]},
    { "town": "宮地岳町", "ranges": [{"start": 0.0, "end": 99999.0, "location": "宮地岳"}] },
    { "town": "志柿町", "ranges": [
        {"start": 1.0, "end": 400.0, "location": "島子"},
        {"start": 400.0, "end": 4700.0, "location": "志柿"}, 
        {"start": 4700.0, "end": 5320.0, "location": "下浦"},
        {"start": 5320.0, "end": 7000.0, "location": "亀場"},
        {"start": 7000.0, "end": 99999.0, "location": "志柿"}
    ]},
    { "town": "下浦町", "ranges": [{"start": 0.0, "end": 99999.0, "location": "下浦"}] },
    { "town": "牛深町", "ranges": [
        {"start": 1.0, "end": 90.0, "location": "牛深 OR 魚貫"},
        {"start": 90.0, "end": 300.0, "location": "牛深 OR 久玉"}, 
        {"start": 300.0, "end": 1600.0, "location": "牛深 OR 魚貫"},
        {"start": 1600.0, "end": 99999.0, "location": "牛深"}
    ]},
    { "town": "魚貫町", "ranges": [
        {"start": 1.0, "end": 3400.0, "location": "魚貫"},
        {"start": 3400.0, "end": 99999.0, "location": "魚貫崎"}
    ]},
    { "town": "二浦町早浦", "ranges": [{"start": 0.0, "end": 99999.0, "location": "亀浦"}] },
    { "town": "二浦町亀浦", "ranges": [
        {"start": 1.0, "end": 2200.0, "location": "亀浦"},
        {"start": 2200.0, "end": 2600.0, "location": "向辺田"}, 
        {"start": 2600.0, "end": 99999.0, "location": "亀浦"}
    ]},
    { "town": "久玉町", "ranges": [
        {"start": 1.0, "end": 40.0, "location": "牛深 OR 山の浦"},
        {"start": 40.0, "end": 1000.0, "location": "久玉 OR 山の浦"}, 
        {"start": 1000.0, "end": 2000.0, "location": "久玉 OR 山の浦 OR 古江"},
        {"start": 2000.0, "end": 5345.0, "location": "久玉 OR 山の浦"},
        {"start": 5345.0, "end": 5705.0, "location": "久玉"},
        {"start": 5705.0, "end": 5706.0, "location": "牛深"},
        {"start": 5706.0, "end": 99999.0, "location": "久玉"}
    ]},
    { "town": "深海町", "ranges": [
        {"start": 1.0, "end": 4800.0, "location": "深海"},
        {"start": 4800.0, "end": 5000.0, "location": "深海 OR 山の浦"}, 
        {"start": 5000.0, "end": 99999.0, "location": "深海"}
    ]},
    { "town": "有明町赤崎", "ranges": [
        {"start": 1.0, "end": 2999.0, "location": "赤崎"},
        {"start": 2999.0, "end": 3039.0, "location": "上津浦"},
        {"start": 3039.0, "end": 99999.0, "location": "赤崎"}
    ]},
    { "town": "有明町須子", "ranges": [{"start": 0.0, "end": 99999.0, "location": "大浦"}] },
    { "town": "有明町大浦", "ranges": [
        {"start": 1.0, "end": 58.0, "location": "楠甫"},
        {"start": 58.0, "end": 4000.0, "location": "大浦"}, 
        {"start": 4000.0, "end": 99999.0, "location": "楠甫"}
    ]},
    { "town": "有明町楠甫", "ranges": [{"start": 0.0, "end": 99999.0, "location": "楠甫"}] },
    { "town": "有明町上津浦", "ranges": [
        {"start": 1.0, "end": 1880.0, "location": "上津浦"},
        {"start": 1880.0, "end": 3200.0, "location": "赤崎"}, 
        {"start": 3200.0, "end": 5000.0, "location": "上津浦"},
        {"start": 5000.0, "end": 99999.0, "location": "河内"}
    ]},
    { "town": "有明町下津浦", "ranges": [
        {"start": 1.0, "end": 1712.0, "location": "上津浦"},
        {"start": 1712.0, "end": 1719.0, "location": "河内"},
        {"start": 1719.0, "end": 1893.0, "location": "上津浦"},
        {"start": 1893.0, "end": 1894.0, "location": "河内"},
        {"start": 1894.0, "end": 3721.0, "location": "上津浦"},
        {"start": 3721.0, "end": 3881.0, "location": "河内"},
        {"start": 3881.0, "end": 4639.0, "location": "上津浦"},
        {"start": 4639.0, "end": 4640.0, "location": "河内"},
        {"start": 4640.0, "end": 99999.0, "location": "上津浦"}
    ]},
    { "town": "有明町大島子", "ranges": [{"start": 0.0, "end": 99999.0, "location": "島子"}] },
    { "town": "有明町小島子", "ranges": [
        {"start": 1.0, "end": 800.0, "location": "上津浦"},
        {"start": 800.0, "end": 1320.0, "location": "島子"}, 
        {"start": 1320.0, "end": 1326.0, "location": "上津浦"},
        {"start": 1326.0, "end": 99999.0, "location": "島子"}
    ]},
    { "town": "御所浦町御所浦", "ranges": [
        {"start": 1.0, "end": 1200.0, "location": "外平"},
        {"start": 1200.0, "end": 3101.0, "location": "嵐口"},
        {"start": 3101.0, "end": 4960.0, "location": "御所浦"}, 
        {"start": 4960.0, "end": 5679.0, "location": "元浦"},
        {"start": 5679.0, "end": 99999.0, "location": "大浦(御所浦)"}
    ]},
    { "town": "御所浦町牧島", "ranges": [
        {"start": 1.0, "end": 1010.0, "location": "牧本"},
        {"start": 1010.0, "end": 2000.0, "location": "長浦"}, 
        {"start": 2000.0, "end": 99999.0, "location": "椛の木"}
    ]},
    { "town": "御所浦町横浦", "ranges": [
        {"start": 1.0, "end": 600.0, "location": "(横浦港)船のみ"},
        {"start": 600.0, "end": 99999.0, "location": "(与一ヶ浦港)船のみ"}
    ]},
    { "town": "倉岳町棚底", "ranges": [{"start": 0.0, "end": 99999.0, "location": "棚底"}] },
    { "town": "倉岳町宮田", "ranges": [
        {"start": 1.0, "end": 1533.0, "location": "宮田"},
        {"start": 1533.0, "end": 1534.0, "location": "棚底"},
        {"start": 1534.0, "end": 3260.0, "location": "宮田"}, 
        {"start": 3260.0, "end": 3600.0, "location": "棚底 OR 宮田"},
        {"start": 3600.0, "end": 3820.0, "location": "宮田"},
        {"start": 3820.0, "end": 3880.0, "location": "棚底 OR 宮田"},
        {"start": 3880.0, "end": 99999.0, "location": "宮田"}
    ]},
    { "town": "倉岳町浦", "ranges": [
        {"start": 1.0, "end": 400.0, "location": "棚底"},
        {"start": 400.0, "end": 99999.0, "location": "浦"}
    ]},
    { "town": "栖本町馬場", "ranges": [{"start": 0.0, "end": 99999.0, "location": "馬場"}] },
    { "town": "栖本町打田", "ranges": [{"start": 0.0, "end": 99999.0, "location": "馬場"}] },
    { "town": "栖本町湯船原", "ranges": [{"start": 0.0, "end": 99999.0, "location": "馬場"}] },
    { "town": "栖本町古江", "ranges": [
        {"start": 1.0, "end": 800.0, "location": "馬場"},
        {"start": 800.0, "end": 1400.0, "location": "宮田"}, 
        {"start": 1400.0, "end": 99999.0, "location": "馬場"}
    ]},
    { "town": "栖本町河内", "ranges": [{"start": 0.0, "end": 99999.0, "location": "河内"}] },
    { "town": "新和町小宮地", "ranges": [
        {"start": 1.0, "end": 8700.0, "location": "小宮地"},
        {"start": 8700.0, "end": 9500.0, "location": "中田"}, 
        {"start": 9500.0, "end": 99999.0, "location": "立"}
    ]},
    { "town": "新和町大宮地", "ranges": [
        {"start": 1.0, "end": 2100.0, "location": "小宮地"},
        {"start": 2100.0, "end": 4007.0, "location": "宮地岳"}, 
        {"start": 4007.0, "end": 5000.0, "location": "小宮地"},
        {"start": 5000.0, "end": 99999.0, "location": "宮地岳"}
    ]},
    { "town": "新和町大多尾", "ranges": [
        {"start": 1.0, "end": 4560.0, "location": "大多尾"},
        {"start": 4560.0, "end": 5000.0, "location": "小宮地"}, 
        {"start": 5000.0, "end": 99999.0, "location": "大多尾"}
    ]},
    {"town": "新和町碇石", "ranges": [
        {"start": 1.0, "end": 1030.0, "location": "小宮地"},
        {"start": 1030.0, "end": 99999.0, "location": "宮地岳"}
    ]},
    {"town": "新和町中田", "ranges": [{"start": 0.0, "end": 99999.0, "location": "中田"}] },
    { "town": "五和町御領", "ranges": [
        {"start": 1.0, "end": 8720.0, "location": "御領"},
        {"start": 8720.0, "end": 10800.0, "location": "鬼池"}, 
        {"start": 10800.0, "end": 12134.0, "location": "御領"},
        {"start": 12134.0, "end": 12135.0, "location": "鬼池"},
        {"start": 12135.0, "end": 99999.0, "location": "御領"}
    ]},
    { "town": "五和町鬼池", "ranges": [{"start": 0.0, "end": 99999.0, "location": "鬼池"}] },
    { "town": "五和町二江", "ranges": [{"start": 0.0, "end": 99999.0, "location": "二江"}] },
    { "town": "五和町手野一丁目", "ranges": [
        {"start": 1.0, "end": 410.0, "location": "城河原"},
        {"start": 410.0, "end": 99999.0, "location": "手野"}
    ]},
    { "town": "五和町手野二丁目", "ranges": [
        {"start": 1.0, "end": 1081.0, "location": "手野"},
        {"start": 1081.0, "end": 1410.0, "location": "二江"}, 
        {"start": 1410.0, "end": 99999.0, "location": "手野"}
    ]},
    { "town": "五和町城河原一丁目", "ranges": [
        {"start": 0.0, "end": 4106.0, "location": "城河原"},
        {"start": 4106.0, "end": 4107.0, "location": "手野"},
        {"start": 4107.0, "end": 4182.0, "location": "城河原"}, 
        {"start": 4182.0, "end": 4183.0, "location": "手野"},
        {"start": 4183.0, "end": 99999.0, "location": "城河原"}
    ]},
    { "town": "五和町城河原二丁目", "ranges": [{"start": 0.0, "end": 99999.0, "location": "城河原"}] },
    { "town": "五和町城河原三丁目", "ranges": [{"start": 0.0, "end": 99999.0, "location": "城河原"}] },
    { "town": "天草町高浜北", "ranges": [{"start": 0.0, "end": 99999.0, "location": "高浜"}] },
    { "town": "天草町高浜南", "ranges": [{"start": 0.0, "end": 99999.0, "location": "高浜"}] },
    { "town": "天草町大江", "ranges": [{"start": 0.0, "end": 99999.0, "location": "大江"}] },
    { "town": "天草町大江軍ヶ浦", "ranges": [{"start": 0.0, "end": 99999.0, "location": "大江"}] },
    { "town": "天草町下田北", "ranges": [
        {"start": 1.0, "end": 40.0, "location": "福連木"},
        {"start": 40.0, "end": 99999.0, "location": "下田"}
    ]},
    { "town": "天草町下田南", "ranges": [
        {"start": 1.0, "end": 400.0, "location": "高浜"},
        {"start": 400.0, "end": 99999.0, "location": "下田"}
    ]},
    { "town": "天草町福連木", "ranges": [{"start": 0.0, "end": 99999.0, "location": "福連木"}] },
    { "town": "天草町大江向", "ranges": [
        {"start": 1.0, "end": 100.0, "location": "亀浦"},
        {"start": 100.0, "end": 99999.0, "location": "向辺田"}
    ]},
    { "town": "河浦町河浦", "ranges": [
        {"start": 1.0, "end": 1150.0, "location": "河浦 OR 板之河内"},
        {"start": 1150.0, "end": 99999.0, "location": "河浦"}
    ]},
    { "town": "河浦町崎津", "ranges": [{"start": 0.0, "end": 99999.0, "location": "崎津"}] },
    { "town": "河浦町今富", "ranges": [
        {"start": 1.0, "end": 1930.0, "location": "崎津"},
        {"start": 1930.0, "end": 2060.0, "location": "崎津 OR 亀浦"}, 
        {"start": 2060.0, "end": 99999.0, "location": "崎津"}
    ]},
    { "town": "河浦町新合", "ranges": [
        {"start": 1.0, "end": 530.0, "location": "新合"},
        {"start": 530.0, "end": 640.0, "location": "新合 OR 河浦"}, 
        {"start": 640.0, "end": 99999.0, "location": "新合"}
    ]},
    { "town": "河浦町立原", "ranges": [{"start": 0.0, "end": 99999.0, "location": "新合"}] },
    { "town": "河浦町今田", "ranges": [{"start": 0.0, "end": 99999.0, "location": "河浦 OR 板之河内"}] },
    { "town": "河浦町白木河内", "ranges": [
        {"start": 1.0, "end": 90.0, "location": "古江"},
        {"start": 90.0, "end": 1000.0, "location": "河浦"}, 
        {"start": 1000.0, "end": 1851.0, "location": "新合"},
        {"start": 1851.0, "end": 2168.0, "location": "河浦"}, 
        {"start": 2168.0, "end": 99999.0, "location": "古江"}
    ]},
    { "town": "河浦町久留", "ranges": [{"start": 0.0, "end": 99999.0, "location": "古江"}] },
    { "town": "河浦町路木", "ranges": [{"start": 0.0, "end": 99999.0, "location": "古江"}] },
    { "town": "河浦町宮野河内", "ranges": [
        {"start": 1.0, "end": 1150.0, "location": "宮野河内 OR 中田"},
        {"start": 1150.0, "end": 99999.0, "location": "宮野河内"}
    ]}
];


// --- ユーティリティ関数 ---

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


// --- 旅費地点検索ロジック (コアロジック) ---

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
                return range.location;
            }
        }
        
        return "エラー: 入力された地番の範囲を特定できませんでした。";
        
    } catch (e) {
        console.error("検索処理中に致命的なエラーが発生しました:", e);
        return "エラー: 検索ロジック処理中に例外が発生しました。";
    }
}

/**
 * 2つの地点間の距離と金額を取得する
 * @param {string} startPoint - 起点地点名
 * @param {string} endPoint - 終点地点名
 * @returns {{distance: number, amount: number, error: string}}
 */
function getTravelCost(startPoint, endPoint) {
    const matrix = TRAVEL_MATRIX[startPoint];
    if (!matrix) {
        return { distance: null, amount: null, error: `エラー: 起点「${startPoint}」のデータが見つかりません。` };
    }
    
    const cost = matrix[endPoint];
    if (!cost) {
        // 御所浦島内からメインエリアへの移動はデータなし
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
    if (pointName.includes("OR") || pointName.includes("or")) {
        // "A OR B" の形式の場合、最初の地点 "A" を使用
        return pointName.split("OR")[0].split("or")[0].trim();
    }
    // 御所浦の大浦を正規化
    if (pointName === "大浦(御所浦)") return "大浦(御所浦)";
    if (pointName === "大浦" && !MAIN_AREA_POINTS.includes(pointName)) return "大浦(御所浦)";
    
    return pointName;
}

// --- UI操作関数 ---

function displayResult(input, startPoint, calculatedPoint, costData, isAmbiguous) {
    const resultArea = document.getElementById('result-area');
    const inputDisplay = document.getElementById('search-input-display');
    const segmentDisplay = document.getElementById('travel-segment-display');
    const pointDisplay = document.getElementById('travel-point-display');
    const costDisplay = document.getElementById('travel-cost-display'); 
    const noteDisplay = document.getElementById('note-display');

    // 終点地点を正規化 (エラーメッセージなどでない場合)
    const endPointDisplay = isAmbiguous ? calculatedPoint : resolveAmbiguousPoint(calculatedPoint);

    inputDisplay.textContent = `検索対象: ${input}`;
    segmentDisplay.textContent = `${startPoint} → ${calculatedPoint}`;
    pointDisplay.textContent = calculatedPoint;
    
    // --- エラー判定 ---
    if (calculatedPoint.startsWith("エラー:") || costData.error) {
        resultArea.style.borderColor = '#dc3545';
        resultArea.style.backgroundColor = '#f8d7da';
        pointDisplay.textContent = calculatedPoint;
        costDisplay.textContent = costData.error || "旅費データが見つかりません。";
        noteDisplay.textContent = "※ 地点特定または旅費データ検索に失敗しました。入力内容を確認するか、市役所にご確認ください。";
        return;
    }

    // --- 成功時の表示 ---
    resultArea.style.borderColor = isAmbiguous ? '#ffc107' : '#28a745'; 
    
    if (isAmbiguous) {
        // 曖昧な地点名の場合は、計算に使用した地点名を明記
        pointDisplay.textContent = `${calculatedPoint} (計算には「${endPointDisplay}」を使用)`;
        noteDisplay.textContent = `※「or」を含む結果は、旅費規定の運用に基づき、いずれかの地点を適用してください。旅費は（）内の最初の地点「${endPointDisplay}」の値を概算として表示しています。`;
        resultArea.style.backgroundColor = '#fff3cd';
    } else {
        pointDisplay.textContent = calculatedPoint;
        noteDisplay.textContent = "※ 特定された地点が旅費算定の基準となります。";
        resultArea.style.backgroundColor = '#e9f7ff';
    }
    
    costDisplay.textContent = `片道 ${costData.distance} km / 往復 ¥${costData.amount.toLocaleString()}`; 
}

function searchByAddress() {
    const startPoint = document.getElementById('start-point-select').value;
    const town = document.getElementById('town-name').value.trim();
    const houseNumStr = document.getElementById('house-number').value.trim();
    
    if (!startPoint) {
        alert("旅費の起点を選択してください。");
        return;
    }
    if (!town || !houseNumStr) {
        alert("終点となる町名と地番を入力してください。");
        return;
    }
    
    const numericHouseNum = parseToNumeric(houseNumStr);
    const calculatedPoint = getTravelPoint(town, numericHouseNum);
    
    const inputStr = `住所: ${town} ${houseNumStr}`;
    const isAmbiguous = calculatedPoint.includes("or") || calculatedPoint.includes("OR");
    
    // 旅費計算に使用する終点地点名
    const endPointForCost = resolveAmbiguousPoint(calculatedPoint);

    const costData = getTravelCost(startPoint, endPointForCost); 
    
    displayResult(inputStr, startPoint, calculatedPoint, costData, isAmbiguous);
}

function searchByFacility() {
    const startPoint = document.getElementById('start-point-select').value;
    const selectElement = document.getElementById('facility-select');
    const facilityName = selectElement.value;

    if (!startPoint) {
        alert("旅費の起点を選択してください。");
        return;
    }
    if (!facilityName) {
        alert("終点となる施設を選択してください。");
        return;
    }
    
    const facility = FACILITY_DATA.find(f => f.name === facilityName);
    const addressParts = parseAddress(facility.address);
    
    const numericHouseNum = parseToNumeric(addressParts.houseNumber);

    const calculatedPoint = getTravelPoint(addressParts.townName, numericHouseNum);
    
    const inputStr = `施設名: ${facilityName} (${facility.address})`;
    const isAmbiguous = calculatedPoint.includes("or") || calculatedPoint.includes("OR");

    // 旅費計算に使用する終点地点名
    const endPointForCost = resolveAmbiguousPoint(calculatedPoint);
    
    const costData = getTravelCost(startPoint, endPointForCost);
    
    displayResult(inputStr, startPoint, calculatedPoint, costData, isAmbiguous);
}

// --- 初期化 ---

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

function initializeApp() {
    const facilitySelect = document.getElementById('facility-select');
    const startPointSelect = document.getElementById('start-point-select');

    // 1. 起点選択ドロップダウンの準備
    const sortedPoints = [...ALL_POINTS].sort((a, b) => a.localeCompare(b, 'ja'));
    sortedPoints.forEach(point => {
        const option = document.createElement('option');
        // 御所浦の「大浦」は、メインエリアの「大浦」と区別するため括弧書きのまま表示
        option.value = point;
        option.textContent = point.replace("(御所浦)", " (御所浦島内)");
        startPointSelect.appendChild(option);
    });
    
    // 2. 施設選択ドロップダウンの準備 (前回同様)
    const uniqueFacilities = [];
    const seen = new Set();
    FACILITY_DATA.forEach(facility => {
        const key = facility.name + '|' + facility.address;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueFacilities.push(facility);
        }
    });

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
        facilitySelect.appendChild(option);
    });

    // 3. 検索モード切り替え
    const modeAddressBtn = document.getElementById('mode-address');
    const modeFacilityBtn = document.getElementById('mode-facility');
    const formAddress = document.getElementById('address-search-form');
    const formFacility = document.getElementById('facility-search-form');

    const resetResultArea = () => {
        const resultArea = document.getElementById('result-area');
        resultArea.style.borderColor = '#ccc';
        resultArea.style.backgroundColor = '#f9f9f9';
        document.getElementById('search-input-display').textContent = '---';
        document.getElementById('travel-segment-display').textContent = '---';
        document.getElementById('travel-point-display').textContent = '---';
        document.getElementById('travel-cost-display').textContent = '---';
        document.getElementById('note-display').textContent = '※ 特定された地点が旅費算定の基準となります。';
    };

    modeAddressBtn.addEventListener('click', () => {
        modeAddressBtn.classList.add('active');
        modeFacilityBtn.classList.remove('active');
        formAddress.classList.remove('hidden');
        formFacility.classList.add('hidden');
        resetResultArea();
    });

    modeFacilityBtn.addEventListener('click', () => {
        modeFacilityBtn.classList.add('active');
        modeAddressBtn.classList.remove('active');
        formFacility.classList.remove('hidden');
        formAddress.classList.add('hidden');
        resetResultArea();
    });

    // ページロード時の初期リセット
    resetResultArea();
}

// グローバルスコープに関数を公開
window.searchByAddress = searchByAddress;
window.searchByFacility = searchByFacility;

window.onload = initializeApp;
