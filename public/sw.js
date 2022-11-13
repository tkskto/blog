const CACHE_KEY = '1.0.3';
const CACHE_KEY_OLD = ['1.0.1', '1.0.2'];
const OWN_DOMAIN = 'tkskto.me';
const urlsToCache = [
    '/blog/common/css/app.css',
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_KEY).then((cache) => cache.addAll(urlsToCache))
    );
    e.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((cacheName) => CACHE_KEY_OLD.includes(cacheName)).map((cacheName) => {
                    return caches.delete(cacheName);
                })
            );
        })
    );
    e.waitUntil(self.clients.claim());
});

// キャッシュ処理
const fetchAndCache = async (request) => {
    const response = await fetch(request);
    const responseClone = response.clone();

    caches.open(CACHE_KEY).then((cache) => {
        return cache.put(request, responseClone);
    });

    return response;
};

self.addEventListener('fetch', (e) => {
    if (!e.request.url.includes(OWN_DOMAIN)) {
        e.respondWith(fetch(e.request));

        return;
    }

    e.respondWith(async function() {
        const cachedResponse = await caches.open(CACHE_KEY).then((cache) => cache.match(e.request));

        if (cachedResponse) {
            return cachedResponse;
        }

        return fetchAndCache(e.request);
    }());
});
