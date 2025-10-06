import type { LocaleObject } from "@nuxtjs/i18n";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function getTranslationFiles(locale: string) {
    const dirPath = path.join(process.cwd(), "i18n", "locales", locale);
    if (!fs.existsSync(dirPath)) {
        throw new Error(`Locale directory does not exist: ${dirPath}`);
    }

    const files = fs.readdirSync(dirPath);
    return files.filter(file => file.endsWith(".json")).map(file => path.join(locale, file));
}

const locales = ["en-US", "de-DE", "es-ES", "ja-JP"].map(
    locale =>
        ({
            code: locale.split("-")[0],
            language: locale,
            files: getTranslationFiles(locale),
        }) as LocaleObject,
);

export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    vite: { plugins: [tailwindcss()] },
    css: ["~/assets/css/main.css"],
    typescript: {
        typeCheck: true,
    },
    alias: {
        "@e2e": fileURLToPath(new URL("./tests/e2e", import.meta.url)),
    },
    modules: [
        "@nuxt/eslint",
        "@nuxt/image",
        "@nuxt/test-utils",
        "@nuxt/ui",
        "@nuxtjs/color-mode",
        "@nuxtjs/i18n",
        "@nuxt/test-utils/module",
        "@nuxt/test-utils/module",
    ],
    i18n: {
        strategy: "no_prefix",
        defaultLocale: "en",
        baseUrl: process.env.ORIGIN,
        locales,
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
});
