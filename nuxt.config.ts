import { checkTranslationFileConsistency, getTranslationFiles } from "./config/i18n";
import pwa from "./config/pwa";
import { LOCALES } from "./shared/constants/i18n";
import type { LocaleObject } from "@nuxtjs/i18n";
import tailwindcss from "@tailwindcss/vite";

checkTranslationFileConsistency();

export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    vite: { plugins: [tailwindcss()] },
    css: ["~/assets/css/main.css"],
    typescript: {
        typeCheck: true,
        tsConfig: {
            include: ["../tests/**/*", "../playwright/**/*", "../seed/**/*", "../test-utils/**/*"],
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
            meta: [
                { name: "apple-mobile-web-app-title", content: "Grizzl" },
                { name: "viewport", content: "width=device-width, initial-scale=1.0, viewport-fit=cover" },
            ],
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
        "@vite-pwa/nuxt",
    ],
    pwa,
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
