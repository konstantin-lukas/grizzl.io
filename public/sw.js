self.addEventListener("install", event => {
    event.waitUntil(
        caches.open("app-cache").then(cache => {
            return cache.addAll([
                "/", // cache homepage
                "/manifest.json",
                "/web-app-manifest-192x192.png",
                "/web-app-manifest-512x512.png",
            ]);
        }),
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            return cachedResponse || fetch(event.request);
        }),
    );
});
