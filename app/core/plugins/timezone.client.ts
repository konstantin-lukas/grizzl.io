import { TIMEZONE_COOKIE_NAME } from "#shared/core/constants/cookie.constant";
import { getLocalTimeZone } from "@internationalized/date";

export default defineNuxtPlugin(() => {
    const tz = getLocalTimeZone();
    const tzCookie = useCookie(TIMEZONE_COOKIE_NAME, { sameSite: "lax", maxAge: 60 * 60 * 24 * 365 });
    if (tz && tzCookie.value !== tz) tzCookie.value = tz;
});
