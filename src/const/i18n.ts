import type { LanguageKey, Locale } from "@type/i18n";

export const LANGUAGES = {
    "en-US": "English",
    "de-DE": "Deutsch",
    "es-ES": "Español",
    "ja-JP": "日本語",
} as const;

export const LOCALES = Object.keys(LANGUAGES) as Locale[];
export const LANGUAGE_KEYS = Object.keys(LANGUAGES).map(locale => locale.split("-")[0]) as LanguageKey[];
export const [DEFAULT_LOCALE] = LOCALES;
