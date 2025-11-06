import { HttpStatusCode, HttpStatusMessage } from "#shared/constants/http";
import type { EventHandlerRequest, H3Event } from "h3";
import { ZodError, z } from "zod";

export function throwError(
    error: string | Error | ZodError,
    status: keyof typeof HttpStatusCode = "BAD_REQUEST",
): never {
    const message = (() => {
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

export function setStatus(event: H3Event<EventHandlerRequest>, status: keyof typeof HttpStatusCode = "OK") {
    setResponseStatus(event, HttpStatusCode[status], HttpStatusMessage[status]);
}
