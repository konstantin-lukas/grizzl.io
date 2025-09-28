import type { LOCALES } from "@const/i18n";

import type FooterTranslation from "@dictionary/en/footer.json";
import type MenuTranslation from "@dictionary/en/menu.json";
import type UITranslation from "@dictionary/en/ui.json";

export type Locale = (typeof LOCALES)[number];

export interface DictionaryMap {
    footer: typeof FooterTranslation;
    menu: typeof MenuTranslation;
    ui: typeof UITranslation;
}
