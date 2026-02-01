import { HttpStatusCode, HttpStatusMessage } from "#shared/constants/http";
import { LOCALES } from "#shared/constants/i18n";
import { DatabaseIdSchema } from "#shared/validators/id";
import type { ZodType } from "better-auth";
import type { EventHandlerRequest, H3Event } from "h3";
import { getRouterParam, parseCookies, readBody } from "h3";
import { ZodError, z } from "zod";
import NotFoundError from "~~/server/errors/not-found-error";
import { throwError } from "~~/server/utils/http";

type AnyError = string | Error | ZodError;
export default class BaseController {
    protected async tryThrow<T, E extends Error>(promise: Promise<T>): Promise<T> {
        const { data, error } = await tryCatch<T, E>(promise);
        if (error) throwError(error, "UNPROCESSABLE_CONTENT", true);
        return data!;
    }

    protected throwError(
        error: AnyError,
        status: keyof typeof HttpStatusCode = "BAD_REQUEST",
        maskError: boolean = false,
    ): never {
        console.error(error);
        const message = (() => {
            if (maskError) return HttpStatusMessage[status];
            if (error instanceof ZodError) return z.prettifyError(error);
            if (error instanceof Error) return error.message;
            return error;
        })();
        throw createError({
            statusCode: HttpStatusCode[status],
            statusMessage: HttpStatusMessage[status],
            message,
        });
    }

    protected setStatus(event: H3Event<EventHandlerRequest>, status: keyof typeof HttpStatusCode = "OK") {
        setResponseStatus(event, HttpStatusCode[status], HttpStatusMessage[status]);
    }

    protected async safeParseRequestBody<T extends ZodType>(event: H3Event, schema: T) {
        const cookies = parseCookies(event);
        const body = await readBody(event);
        const language = LOCALES.find(locale => locale.code === cookies?.i18n_redirected);
        if (language) z.config(language.zodLocale);
        return z.safeParse<T>(schema, body);
    }

    protected async parseRequestBody<T extends ZodType>(event: H3Event, schema: T) {
        const { success, data, error } = await safeParseRequestBody(event, schema);
        if (!success) throwError(error);
        return data;
    }

    protected parseIdParameter(event: H3Event) {
        const { data, success, error } = DatabaseIdSchema.safeParse(getRouterParam(event, "id"));
        if (!success) throwError(error, "BAD_REQUEST");
        return data;
    }

    protected inferResponse<T>(
        event: H3Event,
        result: Result<T, AnyError>,
    ): asserts result is { data: T; error: null } {
        const { error } = result;

        if (error instanceof NotFoundError) this.throwError("The provided ID was not found.", "NOT_FOUND");
        if (error) this.throwError(error, "UNPROCESSABLE_CONTENT", true);

        if (event.method === "POST") this.setStatus(event, "CREATED");
        if (event.method === "GET") this.setStatus(event, "OK");
        if (event.method === "PUT" || event.method === "PATCH") this.setStatus(event, "NO_CONTENT");
    }
}
