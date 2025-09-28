"use server";

import { LOCALE_COOKIE_NAME } from "@const/cookie";

import type { Locale } from "@type/i18n";

import { tryCatch } from "@util/misc";
import { setCookie } from "@util/server/cookie";

export default async function changeLanguage(language: Locale) {
    // CHECK THAT LANGUAGE IS ACTUALLY OF TYPE LOCALE
    const { error } = await tryCatch(
        (async () => {
            await setCookie(LOCALE_COOKIE_NAME, language);
        })(),
    );
    if (error === null) {
        return { error, data: true };
    }
    return {
        data: null,
        error: [],
    };
}
