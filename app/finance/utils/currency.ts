import type { Language } from "#shared/core/constants/i18n.constant";

export function getCurrencies(locale: Language) {
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

export function formatCurrency(locale: Language, currency: string, amount: number) {
    const currencyFormat = new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
    });

    const digits = currencyFormat.resolvedOptions().maximumFractionDigits ?? 0;
    const denominator = 10 ** digits;
    const resolvedAmount = amount / denominator;

    return currencyFormat.format(resolvedAmount);
}
