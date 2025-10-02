import changeLanguage from "@action/changeLanguage";

import useActionState from "@hook/useActionState";

import type { Locale } from "@type/i18n";

export function useChangeLanguage(language: Locale) {
    const { action } = useActionState(changeLanguage.bind(null, language), { data: false, error: null });
    return action;
}
