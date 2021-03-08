const CACHE_KEY = 'tkskto.me.blog';
const urlsToCache = [
    '/blog/common/css/app.css',
    '/blog/common/css/vendors/app.css',
    '/blog/common/css/pages/blog/index.css',
    '/blog/index.html',
];

self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE_KEY).then((cache) => cache.addAll(urlsToCache)));
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
