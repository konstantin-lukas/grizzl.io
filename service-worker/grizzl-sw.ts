/// <reference lib="WebWorker" />
/// <reference types="vite/client" />
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";

declare const self: ServiceWorkerGlobalScope;

self.addEventListener("message", event => {
    if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

precacheAndRoute(self.__WB_MANIFEST);

cleanupOutdatedCaches();

registerRoute(
    ({ request, sameOrigin, url }) => sameOrigin && request.mode === "navigate" && url.pathname !== "/signin",
    new NetworkFirst({
        cacheName: "navigation-cache",
        networkTimeoutSeconds: 5,
        plugins: [
            new CacheableResponsePlugin({ statuses: [200] }),
            new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 60 * 30 }),
        ],
    }),
);

registerRoute(
    ({ request, sameOrigin }) => sameOrigin && request.destination === "manifest",
    new NetworkFirst({
        cacheName: "webmanifest-cache",
        plugins: [new CacheableResponsePlugin({ statuses: [200] }), new ExpirationPlugin({ maxEntries: 100 })],
    }),
);

registerRoute(
    ({ sameOrigin, url }) => sameOrigin && url.pathname.startsWith("/_i18n/"),
    new StaleWhileRevalidate({
        cacheName: "i18n-cache",
        plugins: [new CacheableResponsePlugin({ statuses: [200] }), new ExpirationPlugin({ maxEntries: 10 })],
    }),
);

registerRoute(
    ({ request, sameOrigin }) => sameOrigin && request.destination === "image",
    new CacheFirst({
        cacheName: "image-cache",
        plugins: [
            new CacheableResponsePlugin({ statuses: [200] }),
            new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 3 }),
        ],
    }),
);

registerRoute(
    ({ request, sameOrigin }) => sameOrigin && request.destination === "audio",
    new CacheFirst({
        cacheName: "audio-cache",
        plugins: [
            new CacheableResponsePlugin({ statuses: [200] }),
            new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 3 }),
        ],
    }),
);

registerRoute(
    ({ request, sameOrigin }) => sameOrigin && ["style", "script"].includes(request.destination),
    new StaleWhileRevalidate({
        cacheName: "asset-cache",
        plugins: [
            new CacheableResponsePlugin({ statuses: [200] }),
            new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 }),
        ],
    }),
);
