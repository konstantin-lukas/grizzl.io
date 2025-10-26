import type { EventHandlerRequest, H3Event } from "h3";
import { z } from "zod";
import LOCALES from "~~/i18n/locales";

export async function safeParseRequestBody(
    event: H3Event<EventHandlerRequest>,
    schema: Parameters<typeof z.safeParse>[0],
) {
    const cookies = parseCookies(event);
    const body = await readBody(event);
    const language = LOCALES.find(locale => locale.code === cookies.i18n_redirected)?.code ?? "en";
    const {
        data: { default: locale },
        error,
    } = await tryCatch(import(`zod/v4/locales/${language}.js`));
    if (!error) z.config(locale());
    return z.safeParse(schema, body);
}
