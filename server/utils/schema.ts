import { DatabaseIdSchema } from "#shared/schema/id";
import type { ZodType } from "better-auth";
import type { EventHandlerRequest, H3Event } from "h3";
import { z } from "zod";
import LOCALES from "~~/i18n/locales";

export async function safeParseRequestBody<T extends ZodType>(event: H3Event<EventHandlerRequest>, schema: T) {
    const cookies = parseCookies(event);
    const body = await readBody(event);
    const language = LOCALES.find(locale => locale.code === cookies.i18n_redirected)?.code ?? "en";
    const {
        data: { default: locale },
        error,
    } = await tryCatch(import(`zod/v4/locales/${language}.js`));
    if (!error) z.config(locale());
    return z.safeParse<T>(schema, body);
}

export async function parseRequestBody<T extends ZodType>(event: H3Event<EventHandlerRequest>, schema: T) {
    const { success, data, error } = await safeParseRequestBody(event, schema);
    if (!success) throwError(error);
    return data;
}

export async function parseIdParameter(event: H3Event<EventHandlerRequest>) {
    const { data, success, error } = DatabaseIdSchema.safeParse(getRouterParam(event, "id"));
    if (!success) throwError(error, "BAD_REQUEST");
    return data;
}
