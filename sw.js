// sw.js

const CACHE_NAME = 'travel-cost-v4'; // バージョン更新
const CACHE_ASSETS = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './data.js',
    './manifest.json',
    './icon-192x192.png',
    './icon-512x512.png'
];

// インストール時のキャッシュ処理
self.addEventListener('install', (event) => {
    // 待機せずにすぐ有効化
    self.skipWaiting(); 
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching app assets');
                return cache.addAll(CACHE_ASSETS);
            })
    );
});

// フェッチ時のキャッシュ利用処理
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// アクティベート時の古いキャッシュ削除
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Clearing old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
