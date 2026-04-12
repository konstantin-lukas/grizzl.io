import { getLocalTimeZone } from "@internationalized/date";

export default defineNuxtPlugin(() => {
    const tz = getLocalTimeZone();
    const tzCookie = useCookie("tz", { sameSite: "lax", maxAge: 60 * 60 * 24 * 365 });
    if (tz && tzCookie.value !== tz) tzCookie.value = tz;
});
