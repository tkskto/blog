const CACHE_KEY = 'tkskto.me.blog';
const urlsToCache = [
    '/blog/common/css/app.css',
    '/blog/common/css/vendors/app.css',
    '/blog/index.html',
];

self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE_KEY).then((cache) => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            if (response) {
                return response;
            }

            return fetch(e.request.clone());
        })
    );
});
