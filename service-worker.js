const CACHE_NAME = 'emiratech-cache-v1';
const FILES_TO_CACHE = [
  '/EmiraTech-MW/',
  '/EmiraTech-MW/index.html',
  '/EmiraTech-MW/products.html',
  '/EmiraTech-MW/blog.html',
  '/EmiraTech-MW/style.css',
  '/EmiraTech-MW/script.js',
  '/EmiraTech-MW/icons/icon-192.png',
  '/EmiraTech-MW/icons/icon-512.png'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  evt.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(resp => resp || fetch(evt.request).catch(() => caches.match('/EmiraTech-MW/index.html')))
  );
});
