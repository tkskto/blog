const CACHE_KEY = '1.0.1';
const CACHE_KEY_OLD = 'tkskto.me.blog';
const urlsToCache = [
    '/blog/common/css/app.css',
    '/blog/common/css/vendors/app.css',
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        Promise.all([
            caches.open(CACHE_KEY_OLD).then((cache) => cache.delete(CACHE_KEY_OLD)),
            caches.open(CACHE_KEY).then((cache) => cache.addAll(urlsToCache))
        ])
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(async function() {
        const cachedResponse = await caches.match(e.request);

        if (cachedResponse) {
            return cachedResponse;
        }

        return fetch(e.request);
    }());
});
