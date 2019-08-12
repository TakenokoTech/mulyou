// キャッシュファイルの指定 //
const CACHE_NAME = 'pwa-mulyou-caches';
const FILES_TO_CACHE = ['./index.html'];
console.log('[ServiceWorker] loading...');

// インストール処理 //
self.addEventListener('install', event => {
  console.log('[ServiceWorker] install');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[ServiceWorker] Pre-caching offline page');
      return cache.addAll(FILES_TO_CACHE);
    }),
  );
});

// リソースフェッチ時のキャッシュロード処理 //
self.addEventListener('fetch', event => {
  console.log('[ServiceWorker] fetch');
  event.respondWith(
    caches.match(event.request).then(response => {
      return response ? response : fetch(event.request);
    }),
  );
});
