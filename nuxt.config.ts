import LOCALES from "./i18n/locales";
import type { LocaleObject } from "@nuxtjs/i18n";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";

function collectKeys(obj: Record<string, never>, prefix = ""): Set<string> {
    const keys = new Set<string>();

    for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;

        keys.add(fullKey);

        if (value && typeof value === "object" && !Array.isArray(value)) {
            for (const nestedKey of collectKeys(value, fullKey)) {
                keys.add(nestedKey);
            }
        }
    }

    return keys;
}

export function checkTranslationFileConsistency() {
    const translationDir = new URL("./i18n/locales", import.meta.url).pathname;

    const locales = fs.readdirSync(translationDir).filter(f => fs.statSync(path.join(translationDir, f)).isDirectory());

    const expectedFiles = fs
        .readdirSync(path.join(translationDir, locales[0]!))
        .filter(f => f.endsWith(".json"))
        .sort();

    for (const locale of locales) {
        const files = fs
            .readdirSync(path.join(translationDir, locale))
            .filter(f => f.endsWith(".json"))
            .sort();

        if (JSON.stringify(files) !== JSON.stringify(expectedFiles)) {
            throw new Error(`File mismatch in subdirectory "${locale}"`);
        }
    }

    for (const file of expectedFiles) {
        let expectedKeys: Set<string> | null = null;
        const hasMissingKeys = (keys: Set<string>, key: string) => !keys.has(key);
        const hasExtraKeys = (key: string) => !expectedKeys!.has(key);

        for (const locale of locales) {
            const filePath = path.join(translationDir, locale, file);
            const rawData = fs.readFileSync(filePath, "utf-8");
            const data = JSON.parse(rawData);

            const keys = collectKeys(data);
            if (!expectedKeys) {
                expectedKeys = keys;
            } else {
                const missingInCurrent = [...expectedKeys].filter(key => hasMissingKeys(keys, key));
                const extraInCurrent = [...keys].filter(key => hasExtraKeys(key));
                if (missingInCurrent.length || extraInCurrent.length) {
                    throw new Error(
                        `Key mismatch in file "${file}" in subdirectory "${locale}".\n` +
                            `Missing keys: ${missingInCurrent.join(", ")}\n` +
                            `Extra keys: ${extraInCurrent.join(", ")}`,
                    );
                }
            }
        }
    }
}

checkTranslationFileConsistency();

export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    vite: { plugins: [tailwindcss()] },
    css: ["~/assets/css/main.css"],
    typescript: {
        typeCheck: true,
    },
    app: {
        head: {
            link: [
                { rel: "icon", type: "image/png", href: "/favicon-96x96.png", sizes: "96x96" },
                { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
                { rel: "shortcut icon", href: "/favicon.ico" },
                { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
                { rel: "manifest", href: "/manifest.webmanifest" },
            ],
            meta: [{ name: "apple-mobile-web-app-title", content: "Grizzl" }],
        },
    },
    modules: [
        "@nuxt/eslint",
        "@nuxt/image",
        "@nuxt/test-utils",
        "@nuxt/ui",
        "@nuxtjs/color-mode",
        "@nuxtjs/i18n",
        "@nuxt/test-utils/module",
        "@nuxt/fonts",
        "@vite-pwa/nuxt",
    ],
    pwa: {
        manifest: {
            name: "Grizzl - The Bear That Does It All",
            short_name: "Grizzl",
            description: "Your everything in one app for daily tasks.",
            start_url: "/",
            display: "standalone",
            display_override: ["fullscreen", "minimal-ui"],
            background_color: "#ffffff",
            theme_color: "#000000",
            id: "/",
            icons: [
                {
                    src: "/web-app-manifest-192x192.png",
                    sizes: "192x192",
                    type: "image/png",
                },
                {
                    src: "/web-app-manifest-512x512.png",
                    sizes: "512x512",
                    type: "image/png",
                },
            ],
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
                    urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
                    method: "GET",
                    handler: "CacheFirst",
                    options: {
                        cacheName: "images-cache",
                        expiration: {
                            maxEntries: 60,
                            maxAgeSeconds: 10 * 24 * 60 * 60,
                        },
                    },
                },
                {
                    urlPattern: /\/api\/.*$/,
                    method: "GET",
                    handler: "NetworkFirst",
                    options: {
                        cacheName: "api-cache",
                        networkTimeoutSeconds: 10,
                    },
                },
            ],
        },
    },
    i18n: {
        strategy: "no_prefix",
        defaultLocale: "en",
        baseUrl: process.env.NUXT_PUBLIC_ORIGIN,
        locales: LOCALES as LocaleObject[],
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: "i18n_redirected",
            redirectOn: "root",
            cookieSecure: process.env.APP_ENV === "production",
        },
    },
    colorMode: {
        classSuffix: "",
    },
    icon: {
        mode: "css",
        cssLayer: "base",
        customCollections: [
            {
                prefix: "local",
                dir: "./app/assets/svg",
                normalizeIconName: false,
            },
        ],
    },
    runtimeConfig: {
        public: {
            version: process.env.NUXT_PUBLIC_VERSION,
            appEnv: process.env.NUXT_PUBLIC_APP_ENV,
        },
    },
});
