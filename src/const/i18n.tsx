import DE from "@component/icon/flag/DE";
import ES from "@component/icon/flag/ES";
import EN from "@component/icon/flag/GB";
import JA from "@component/icon/flag/JP";

export const LANGUAGES = {
    en: { name: "English", flag: <EN className="shadow-sm" /> },
    de: { name: "Deutsch", flag: <DE className="shadow-sm" /> },
    es: { name: "Español", flag: <ES className="shadow-sm" /> },
    ja: { name: "日本語", flag: <JA className="shadow-sm" /> },
};
export const LOCALES = Object.keys(LANGUAGES) as (keyof typeof LANGUAGES)[];
export const [DEFAULT_LOCALE] = LOCALES;
