/// <reference lib="WebWorker" />
/// <reference types="vite/client" />
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";

declare const self: ServiceWorkerGlobalScope;

self.addEventListener("message", event => {
    if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

const entries = self.__WB_MANIFEST;
entries.push({ url: "/", revision: Math.random().toString() });

precacheAndRoute(entries);

cleanupOutdatedCaches();

const allowlist: undefined | RegExp[] = [/^\/$/];

const denylist: undefined | RegExp[] = [
    /^\/api\//,
    /^\/auth\//,
    /^\/signin\//,
    /^\/sw.js$/,
    /^\/grizzl-sw.js$/,
    /^\/manifest-(.*).webmanifest$/,
];
registerRoute(
    ({ request, sameOrigin }) => sameOrigin && request.destination === "manifest",
    new NetworkFirst({
        cacheName: "webmanifest-cache",
        plugins: [new CacheableResponsePlugin({ statuses: [200] }), new ExpirationPlugin({ maxEntries: 100 })],
    }),
);

registerRoute(new NavigationRoute(createHandlerBoundToURL("/"), { allowlist, denylist }));
