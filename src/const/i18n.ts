export const LANGUAGES = {
    en: "English",
    de: "Deutsch",
    es: "Español",
    ja: "日本語",
};
export const LOCALES = Object.keys(LANGUAGES) as (keyof typeof LANGUAGES)[];
export const [DEFAULT_LOCALE] = LOCALES;
