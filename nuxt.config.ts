import { icons } from "./config/icons.json";
import { EnvSchema } from "./lib/env";
import { checkTranslationFileConsistency, getTranslationFiles } from "./lib/i18n";
import { LOCALES } from "./shared/constants/i18n";
import type { LocaleObject } from "@nuxtjs/i18n";
import tailwindcss from "@tailwindcss/vite";

if (process.env.NODE_ENV !== "test") EnvSchema.parse(process.env);
checkTranslationFileConsistency();

export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    vite: { plugins: [tailwindcss()] },
    css: ["~/assets/css/main.css"],
    typescript: {
        typeCheck: true,
        tsConfig: {
            compilerOptions: {
                noUncheckedIndexedAccess: true,
            },
        },
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
        locales: LOCALES.map(({ code, language }) => ({
            code,
            language,
            files: getTranslationFiles(language),
        })) as LocaleObject[],
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
            legalEntity: process.env.NUXT_PUBLIC_LEGAL_RESPONSIBLE_ENTITY,
            legalStreet: process.env.NUXT_PUBLIC_LEGAL_STREET,
            legalCity: process.env.NUXT_PUBLIC_LEGAL_ZIP_AND_CITY,
            legalPhone: process.env.NUXT_PUBLIC_LEGAL_PHONE,
            legalEmail: process.env.NUXT_PUBLIC_LEGAL_EMAIL,
        },
    },
});
