import DE from "@component/icon/flag/DE";
import ES from "@component/icon/flag/ES";
import EN from "@component/icon/flag/GB";
import JA from "@component/icon/flag/JP";

export const LANGUAGES = {
    en: { name: "English", flag: <EN /> },
    de: { name: "Deutsch", flag: <DE /> },
    es: { name: "Español", flag: <ES /> },
    ja: { name: "日本語", flag: <JA className="shadow-xl" /> },
};
export const LOCALES = Object.keys(LANGUAGES) as (keyof typeof LANGUAGES)[];
export const [DEFAULT_LOCALE] = LOCALES;
