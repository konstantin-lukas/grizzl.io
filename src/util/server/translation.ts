import { cookies, headers } from "next/headers";
import "server-only";

import { LOCALE_COOKIE_NAME } from "@const/cookie";
import { DEFAULT_LOCALE, LOCALES } from "@const/i18n";

import type FooterTranslation from "@dictionary/en/footer.json";
import type MenuTranslation from "@dictionary/en/menu.json";

import type { Locale } from "@type/i18n";

type Page = "footer" | "menu";

export async function getDictionary(locale: Locale, page: "footer"): Promise<typeof FooterTranslation>;
export async function getDictionary(locale: Locale, page: "menu"): Promise<typeof MenuTranslation>;
export async function getDictionary(locale: Locale, page: Page) {
    return import(`../../dictionary/${locale}/${page}.json`).then(module => module.default);
}

export async function getLocaleFromRequest() {
    const cookieLocale = (await cookies()).get(LOCALE_COOKIE_NAME)?.value as Locale;
    if (cookieLocale && LOCALES.includes(cookieLocale)) return cookieLocale;

    const acceptLanguage = (await headers()).get("Accept-Language");
    if (acceptLanguage) {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Accept-Language
        const preferred = acceptLanguage.split(",").map(lang => lang.split(";")[0].split("-")[0]);
        const match = preferred.find((lang): lang is Locale => LOCALES.includes(lang as never));
        if (match) return match;
    }

    return DEFAULT_LOCALE;
}
