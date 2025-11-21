import { de as uiDe, en as uiEn, es as uiEs, ja as uiJa } from "@nuxt/ui/locale";
import { de as fnsDe, enUS as fnsEn, es as fnsEs, ja as fnsJa } from "date-fns/locale";
import { de as zodDe, en as zodEn, es as zodEs, ja as zodJa } from "zod/locales";

const languages = [
    { locale: "en-US", zodLocale: zodEn(), fnsLocale: fnsEn, uiLocale: uiEn },
    { locale: "de-DE", zodLocale: zodDe(), fnsLocale: fnsDe, uiLocale: uiDe },
    { locale: "es-ES", zodLocale: zodEs(), fnsLocale: fnsEs, uiLocale: uiEs },
    { locale: "ja-JP", zodLocale: zodJa(), fnsLocale: fnsJa, uiLocale: uiJa },
] as const;
type LanguageCode = (typeof languages)[number]["locale"] extends `${infer T}-${string}` ? T : never;

export const LOCALES = languages.map(({ locale, zodLocale, fnsLocale, uiLocale }) => ({
    code: locale.split("-")[0],
    language: locale,
    zodLocale,
    fnsLocale,
    uiLocale,
})) as {
    code: LanguageCode;
    language: (typeof languages)[number]["locale"];
    zodLocale: ReturnType<typeof zodEn>;
    fnsLocale: typeof fnsEn;
    uiLocale: typeof uiEn;
}[];
