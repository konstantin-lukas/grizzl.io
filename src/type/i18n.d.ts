import type { LANGUAGES } from "@const/i18n";

import type FooterTranslation from "@dictionary/en-US/footer.json";
import type HomeTranslation from "@dictionary/en-US/home.json";
import type LegalTranslation from "@dictionary/en-US/legal.json";
import type MenuTranslation from "@dictionary/en-US/menu.json";
import type PrivacyTranslation from "@dictionary/en-US/privacy.json";
import type UITranslation from "@dictionary/en-US/ui.json";

export type Locale = keyof typeof LANGUAGES;
export type LanguageKey = Locale extends `${infer L}-${string}` ? L : never;

export interface DictionaryMap {
    footer: typeof FooterTranslation;
    menu: typeof MenuTranslation;
    ui: typeof UITranslation;
    privacy: typeof PrivacyTranslation;
    legal: typeof LegalTranslation;
    home: typeof HomeTranslation;
}
