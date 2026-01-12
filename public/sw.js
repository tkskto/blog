const CACHE_KEY = '1.0.5';
const CACHE_KEY_OLD = ['1.0.1', '1.0.2', '1.0.3', '1.0.4'];
const OWN_DOMAIN = 'tkskto.me';
const urlsToCache = [];

self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE_KEY).then((cache) => cache.addAll(urlsToCache)));
    e.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (e) => {
    e.waitUntil(caches.keys().then((cacheNames) => Promise.all(cacheNames.filter((cacheName) => CACHE_KEY_OLD.includes(cacheName)).map((cacheName) => caches.delete(cacheName)))));
    e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
    if (!e.request.url.includes(OWN_DOMAIN)) {
        e.respondWith(fetch(e.request));

        return;
    }

    if (e.request.method !== 'GET') {
        e.respondWith(fetch(e.request));

        return;
    }

    e.respondWith(caches.open(CACHE_KEY).then((cache) => {
        return cache.match(e.request).then((cacheResponse) => {
            const fetchedResponse = fetch(e.request).then((networkResponse) => {
                cache.put(e.request, networkResponse.clone());

                return networkResponse;
            });

            return cacheResponse || fetchedResponse;
        });
    }));
});
