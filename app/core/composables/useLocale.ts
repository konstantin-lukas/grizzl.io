import { LOCALES } from "#shared/core/constants/i18n.constant";

export default function useLocale() {
    const { locale } = useI18n();
    const selected = computed(() => LOCALES.find(({ code }) => code === locale.value)!);

    const code = computed(() => selected.value.code);
    const fnsLocale = computed(() => selected.value.fnsLocale);
    const language = computed(() => selected.value.language);
    const zodLocale = computed(() => selected.value.zodLocale);
    const uiLocale = computed(() => selected.value.uiLocale);

    return { code, fnsLocale, language, zodLocale, uiLocale };
}
