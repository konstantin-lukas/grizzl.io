import { de as uiDe, en as uiEn, es as uiEs, ja as uiJa } from "@nuxt/ui/locale";
import { de as zodDe, en as zodEn, es as zodEs, ja as zodJa } from "zod/locales";

const languages = [
    { locale: "en-US", zodLocale: zodEn(), uiLocale: uiEn },
    { locale: "de-DE", zodLocale: zodDe(), uiLocale: uiDe },
    { locale: "es-ES", zodLocale: zodEs(), uiLocale: uiEs },
    { locale: "ja-JP", zodLocale: zodJa(), uiLocale: uiJa },
] as const;
type LanguageCode = (typeof languages)[number]["locale"] extends `${infer T}-${string}` ? T : never;
export type Language = (typeof LOCALES)[number]["language"];

export const LOCALES = languages.map(({ locale, zodLocale, uiLocale }) => ({
    code: locale.split("-")[0],
    language: locale,
    zodLocale,
    uiLocale,
})) as {
    code: LanguageCode;
    language: (typeof languages)[number]["locale"];
    zodLocale: ReturnType<typeof zodEn>;
    uiLocale: typeof uiEn;
}[];
