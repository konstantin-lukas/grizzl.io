import { LOCALES } from "#shared/constants/i18n";
import { DatabaseIdSchema } from "#shared/validators/id";
import type { ZodType } from "better-auth";
import type { H3Event } from "h3";
import { getRouterParam, parseCookies, readBody } from "h3";
import { ZodError, z } from "zod";
import { generateId } from "~~/server/database/schema/mixins";
import DomainError from "~~/server/errors/domain-error";
import NotFoundError from "~~/server/errors/not-found-error";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class BaseController {
    static HttpStatusCode = {
        CONTINUE: 100,
        SWITCHING_PROTOCOLS: 101,
        PROCESSING: 102,
        OK: 200,
        CREATED: 201,
        ACCEPTED: 202,
        NON_AUTHORITATIVE_INFORMATION: 203,
        NO_CONTENT: 204,
        RESET_CONTENT: 205,
        PARTIAL_CONTENT: 206,
        MULTI_STATUS: 207,
        ALREADY_REPORTED: 208,
        IM_USED: 226,
        MULTIPLE_CHOICES: 300,
        MOVED_PERMANENTLY: 301,
        FOUND: 302,
        SEE_OTHER: 303,
        NOT_MODIFIED: 304,
        USE_PROXY: 305,
        SWITCH_PROXY: 306,
        TEMPORARY_REDIRECT: 307,
        PERMANENT_REDIRECT: 308,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        PAYMENT_REQUIRED: 402,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        METHOD_NOT_ALLOWED: 405,
        NOT_ACCEPTABLE: 406,
        PROXY_AUTHENTICATION_REQUIRED: 407,
        REQUEST_TIMEOUT: 408,
        CONFLICT: 409,
        GONE: 410,
        LENGTH_REQUIRED: 411,
        PRECONDITION_FAILED: 412,
        PAYLOAD_TOO_LARGE: 413,
        URI_TOO_LONG: 414,
        UNSUPPORTED_MEDIA_TYPE: 415,
        RANGE_NOT_SATISFIABLE: 416,
        EXPECTATION_FAILED: 417,
        I_AM_A_TEAPOT: 418,
        MISDIRECTED_REQUEST: 421,
        UNPROCESSABLE_CONTENT: 422,
        LOCKED: 423,
        FAILED_DEPENDENCY: 424,
        UPGRADE_REQUIRED: 426,
        PRECONDITION_REQUIRED: 428,
        TOO_MANY_REQUESTS: 429,
        REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
        UNAVAILABLE_FOR_LEGAL_REASONS: 451,
        INTERNAL_SERVER_ERROR: 500,
        NOT_IMPLEMENTED: 501,
        BAD_GATEWAY: 502,
        SERVICE_UNAVAILABLE: 503,
        GATEWAY_TIMEOUT: 504,
        HTTP_VERSION_NOT_SUPPORTED: 505,
        VARIANT_ALSO_NEGOTIATES: 506,
        INSUFFICIENT_STORAGE: 507,
        LOOP_DETECTED: 508,
        NOT_EXTENDED: 510,
        NETWORK_AUTHENTICATION_REQUIRED: 511,
    };

    static HttpStatusMessage = {
        CONTINUE: "Continue",
        SWITCHING_PROTOCOLS: "Switching Protocols",
        PROCESSING: "Processing",
        OK: "OK",
        CREATED: "Created",
        ACCEPTED: "Accepted",
        NON_AUTHORITATIVE_INFORMATION: "Non-Authoritative Information",
        NO_CONTENT: "No Content",
        RESET_CONTENT: "Reset Content",
        PARTIAL_CONTENT: "Partial Content",
        MULTI_STATUS: "Multi-Status",
        ALREADY_REPORTED: "Already Reported",
        IM_USED: "I'm Used",
        MULTIPLE_CHOICES: "Multiple Choices",
        MOVED_PERMANENTLY: "Moved Permanently",
        FOUND: "Found",
        SEE_OTHER: "See Other",
        NOT_MODIFIED: "Not Modified",
        USE_PROXY: "Use Proxy",
        SWITCH_PROXY: "Switch Proxy",
        TEMPORARY_REDIRECT: "Temporary Redirect",
        PERMANENT_REDIRECT: "Permanent Redirect",
        BAD_REQUEST: "Bad Request",
        UNAUTHORIZED: "Unauthorized",
        PAYMENT_REQUIRED: "Payment Required",
        FORBIDDEN: "Forbidden",
        NOT_FOUND: "Not Found",
        METHOD_NOT_ALLOWED: "Method Not Allowed",
        NOT_ACCEPTABLE: "Not Acceptable",
        PROXY_AUTHENTICATION_REQUIRED: "Proxy Authentication Required",
        REQUEST_TIMEOUT: "Request Timeout",
        CONFLICT: "Conflict",
        GONE: "Gone",
        LENGTH_REQUIRED: "Length Required",
        PRECONDITION_FAILED: "Precondition Failed",
        PAYLOAD_TOO_LARGE: "Payload Too Large",
        URI_TOO_LONG: "URI Too Long",
        UNSUPPORTED_MEDIA_TYPE: "Unsupported Media Type",
        RANGE_NOT_SATISFIABLE: "Range Not Satisfiable",
        EXPECTATION_FAILED: "Expectation Failed",
        I_AM_A_TEAPOT: "I'm a Teapot",
        MISDIRECTED_REQUEST: "Misdirected Request",
        UNPROCESSABLE_CONTENT: "Unprocessable Content",
        LOCKED: "Locked",
        FAILED_DEPENDENCY: "Failed Dependency",
        UPGRADE_REQUIRED: "Upgrade Required",
        PRECONDITION_REQUIRED: "Precondition Required",
        TOO_MANY_REQUESTS: "Too Many Requests",
        REQUEST_HEADER_FIELDS_TOO_LARGE: "Request Header Fields Too Large",
        UNAVAILABLE_FOR_LEGAL_REASONS: "Unavailable For Legal Reasons",
        INTERNAL_SERVER_ERROR: "Internal Server Error",
        NOT_IMPLEMENTED: "Not Implemented",
        BAD_GATEWAY: "Bad Gateway",
        SERVICE_UNAVAILABLE: "Service Unavailable",
        GATEWAY_TIMEOUT: "Gateway Timeout",
        HTTP_VERSION_NOT_SUPPORTED: "HTTP Version Not Supported",
        VARIANT_ALSO_NEGOTIATES: "Variant Also Negotiates",
        INSUFFICIENT_STORAGE: "Insufficient Storage",
        LOOP_DETECTED: "Loop Detected",
        NOT_EXTENDED: "Not Extended",
        NETWORK_AUTHENTICATION_REQUIRED: "Network Authentication Required",
    };

    static throwError(
        error: DomainError | ZodError | Error,
        status: keyof typeof BaseController.HttpStatusCode = "BAD_REQUEST",
        maskError: boolean = false,
    ): never {
        const id = generateId();

        const message = (() => {
            if (maskError) return BaseController.HttpStatusMessage[status];
            if (error instanceof ZodError) return z.prettifyError(error);
            return error.message;
        })().replaceAll(" | ", "; ");

        const logMessage = (() => {
            if (error instanceof DomainError) {
                const { name, logMessage } = error;
                return `${name}: ${logMessage}`;
            }
            return error.message;
        })();

        console.error(`${id} - ${logMessage}`);

        throw createError({
            statusCode: BaseController.HttpStatusCode[status],
            statusMessage: BaseController.HttpStatusMessage[status],
            message: `${message} | ${id}`,
        });
    }

    static async parseRequestBody<T extends ZodType>(event: H3Event, schema: T) {
        const cookies = parseCookies(event);
        const body = await readBody(event);
        const language = LOCALES.find(locale => locale.code === cookies?.i18n_redirected);
        if (language) z.config(language.zodLocale);
        return z.parse<T>(schema, body);
    }

    static parseIdParameter(event: H3Event) {
        return DatabaseIdSchema.parse(getRouterParam(event, "id"));
    }

    /**
     * This method is the central error handler. It is automatically invoked whenever you call a function on a
     * controller created by the dependency injection controller using a proxy.
     * @param event - The event from the current request
     * @param error -
     */
    static mapDomainResultToHttp(event: H3Event, error: Error | null): asserts error is null {
        // DOMAIN ERRORS
        if (error instanceof NotFoundError) BaseController.throwError(error, "NOT_FOUND");

        // CLIENT ERRORS
        if (error instanceof ZodError) BaseController.throwError(error, "BAD_REQUEST");

        // UNEXPECTED SERVER ERRORS
        if (error) BaseController.throwError(error, "INTERNAL_SERVER_ERROR", true);

        const setStatus = (status: keyof typeof BaseController.HttpStatusCode = "OK") => {
            setResponseStatus(event, BaseController.HttpStatusCode[status], BaseController.HttpStatusMessage[status]);
        };

        if (event.method === "POST") setStatus("CREATED");
        if (event.method === "GET") setStatus("OK");
        if (event.method === "PUT" || event.method === "PATCH") setStatus("NO_CONTENT");
    }
}
