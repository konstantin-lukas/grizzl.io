import type { LOCALES } from "#shared/core/constants/i18n.constant";

export function getCurrencies(locale: (typeof LOCALES)[number]["language"]) {
    const availableCurrencies = Intl.supportedValuesOf("currency");
    const displayNames = new Intl.DisplayNames(locale, { type: "currency" });
    const currenciesWithNames = availableCurrencies.map(id => {
        const label = displayNames.of(id);
        if (!label) return null;
        return {
            id,
            label: `${label} (${id})`,
        };
    });

    return currenciesWithNames.filter((currency): currency is { id: string; label: string } => currency !== null);
}
