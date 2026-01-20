import { LOCALES } from "@@/shared/constants/i18n";
import { test } from "@@/tests/e2e/fixtures";

export function withLocale(locale: string, callback: Parameters<typeof test.describe>[2]) {
    test.describe("", { tag: `@${locale}` }, () => {
        test.use({ locale });
        callback();
    });
}

export function forEachLocale<T>(
    callback: (locale: (typeof LOCALES)[0], texts: T) => void,
    texts: Record<(typeof LOCALES)[0]["language"], T>,
): void;

export function forEachLocale(callback: (locale: (typeof LOCALES)[0], texts?: undefined) => void): void;

export function forEachLocale<T>(
    callback: (locale: (typeof LOCALES)[0], texts?: T) => void,
    texts?: Record<(typeof LOCALES)[0]["language"], T>,
) {
    for (const locale of LOCALES) {
        test.describe("", { tag: `@${locale.language}` }, () => {
            test.use({ locale: locale.language });
            callback(locale, texts && texts[locale.language]);
        });
    }
}
