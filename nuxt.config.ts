import LOCALES from "./i18n/locales";
import pkg from "./package.json";
import type { LocaleObject } from "@nuxtjs/i18n";
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    vite: { plugins: [tailwindcss()] },
    css: ["~/assets/css/main.css"],
    typescript: {
        typeCheck: true,
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
    ],
    i18n: {
        strategy: "no_prefix",
        defaultLocale: "en",
        baseUrl: process.env.ORIGIN,
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
            version: pkg.version,
            appEnv: process.env.APP_ENV,
        },
    },
});
