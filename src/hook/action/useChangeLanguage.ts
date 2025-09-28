import type { Locale } from "@type/i18n";
import useActionState from "@hook/useActionState";
import changeLanguage from "@action/changeLanguage";

export function useChangeLanguage(language: Locale) {
    const { action } = useActionState(changeLanguage.bind(null, language), { data: false, error: null });
    return action;
}