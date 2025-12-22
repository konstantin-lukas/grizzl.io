import icons from "./icons";
import type { ModuleOptions } from "@vite-pwa/nuxt";

const pwa: Partial<ModuleOptions> = {
    manifest: {
        name: "Grizzl - The Bear That Does It All",
        short_name: "Grizzl",
        description: "Your everything in one app for daily tasks.",
        start_url: "/",
        display: "fullscreen",
        display_override: ["standalone", "minimal-ui"],
        background_color: "#ffffff",
        theme_color: "#000000",
        id: "/",
        icons,
        screenshots: [
            {
                src: "/desktop-screenshot.png",
                sizes: "1920x1080",
                type: "image/png",
                form_factor: "wide",
            },
            {
                src: "/mobile-screenshot.png",
                sizes: "325x441",
                type: "image/png",
                form_factor: "narrow",
            },
        ],
    },
    client: {
        installPrompt: true,
    },
    workbox: {
        runtimeCaching: [
            {
                urlPattern: ({ request }: { request: Request }) =>
                    request.mode === "navigate" && request.destination === "document",
                handler: "NetworkFirst",
                method: "GET",
                options: {
                    cacheName: "page-cache",
                    networkTimeoutSeconds: 5,
                    expiration: { maxEntries: 100, maxAgeSeconds: 24 * 60 * 60 },
                    cacheableResponse: { statuses: [200] },
                },
            },
            {
                urlPattern: ({ request }: { request: Request }) =>
                    request.destination === "script" ||
                    request.destination === "style" ||
                    request.destination === "worker",
                handler: "NetworkFirst",
                method: "GET",
                options: {
                    cacheName: "asset-cache",
                    expiration: { maxEntries: 300, maxAgeSeconds: 24 * 60 * 60 },
                    cacheableResponse: { statuses: [200] },
                },
            },
            {
                urlPattern: ({ request }: { request: Request }) => request.destination === "image",
                method: "GET",
                handler: "CacheFirst",
                options: {
                    cacheName: "image-cache",
                    expiration: { maxEntries: 100, maxAgeSeconds: 7 * 24 * 60 * 60 },
                    cacheableResponse: { statuses: [200] },
                },
            },
            {
                urlPattern: ({ request }: { request: Request }) => request.destination === "audio",
                handler: "CacheFirst",
                method: "GET",
                options: {
                    cacheName: "audio-cache",
                    expiration: { maxEntries: 15, maxAgeSeconds: 7 * 24 * 60 * 60 },
                    cacheableResponse: { statuses: [200] },
                },
            },
            {
                urlPattern: ({ request }: { request: Request }) => request.destination === "font",
                handler: "CacheFirst",
                method: "GET",
                options: {
                    cacheName: "font-cache",
                    expiration: { maxEntries: 30, maxAgeSeconds: 365 * 24 * 60 * 60 },
                    cacheableResponse: { statuses: [200] },
                },
            },
            {
                urlPattern: ({ url }: { url: URL }) => url.pathname.startsWith("/api/"),
                method: "GET",
                handler: "NetworkFirst",
                options: {
                    cacheName: "api-cache",
                    networkTimeoutSeconds: 10,
                    expiration: { maxEntries: 50, maxAgeSeconds: 5 * 60 },
                },
            },
        ],
    },
};

export default pwa;
