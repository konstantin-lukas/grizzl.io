import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import type { EventHandlerRequest, H3Event } from "h3";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { z } from "zod";
import DomainError from "~~/server/errors/domain-error";
import NotFoundError from "~~/server/errors/not-found-error";
import BaseController from "~~/server/features/core/base.controller";
import { HTTP_CODES } from "~~/test-utils/constants/http";

const { setResponseStatusSpy } = vi.hoisted(() => {
    return {
        setResponseStatusSpy: vi.fn(),
    };
});

mockNuxtImport("setResponseStatus", () => {
    return setResponseStatusSpy;
});

const id = "AAAAaaaaBBBBbbbb";
vi.mock("~~/server/database/mixins", () => {
    return {
        generateId: () => id,
    };
});

const { createErrorSpy } = vi.hoisted(() => {
    return {
        createErrorSpy: vi.fn().mockImplementation(value => value),
    };
});
const consoleErrorMock = vi.spyOn(console, "error").mockImplementation(() => undefined);
const consoleLogMock = vi.spyOn(console, "log").mockImplementation(() => undefined);
mockNuxtImport("createError", () => {
    return createErrorSpy;
});

beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
});

const zodError = z.string().safeParse(0).error!;

describe("throwError", () => {
    const errorMessage = "Oh no!";
    const error400 = (messageExpected: string) => ({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: `${messageExpected} | ${id}`,
    });

    test.each([
        {
            name: "should log an error to the console and return its message",
            error: new Error(errorMessage),
            logExpected: `${id} - ${errorMessage}`,
            createdError: error400(errorMessage),
        },
        {
            name: "should log a zod error to the console and return it prettified",
            error: zodError,
            logExpected: `${id} - ${zodError.message}`,
            createdError: error400("✖ Invalid input: expected string, received number"),
        },
        {
            name: "should log a domain to the console and return its message",
            error: new DomainError("A", "B"),
            logExpected: `${id} - DomainError: B`,
            createdError: error400("A"),
        },
    ])("$name", ({ error, logExpected, createdError }) => {
        expect(() => BaseController.throwError(error)).toThrow();
        expect(consoleErrorMock).toHaveBeenCalledOnce();
        expect(consoleErrorMock).toHaveBeenCalledWith(logExpected);
        expect(consoleLogMock).not.toHaveBeenCalled();
        expect(createErrorSpy).toHaveBeenCalledOnce();
        expect(createErrorSpy).toHaveBeenCalledWith(createdError);
    });

    test.each(HTTP_CODES)(
        "should throw an error with the correct status code and message for %s",
        (code, key, message) => {
            expect(() => BaseController.throwError(new Error(errorMessage), key)).toThrow();
            expect(createErrorSpy).toHaveBeenCalledWith({
                statusCode: code,
                statusMessage: message,
                message: `${errorMessage} | ${id}`,
            });
        },
    );

    test("should allow overriding the returned error message with the http status message", () => {
        expect(() => BaseController.throwError(new Error(errorMessage), "I_AM_A_TEAPOT", true)).toThrow();
        expect(createErrorSpy).toHaveBeenCalledWith({
            statusCode: 418,
            statusMessage: "I'm a Teapot",
            message: `I'm a Teapot | ${id}`,
        });
    });
});

describe("parseIdParameter", () => {
    test.each([
        ["an incorrectly formatted id", "bananas"],
        ["an id containing illegal letters", "222222222222222I"],
        ["a missing id", undefined],
        ["an id that isn't a string", 123],
    ])("should reject %s", async (_, id) => {
        vi.doMock("h3", () => {
            return {
                getRouterParam: () => id,
            };
        });
        const { default: Base } = await import("~~/server/features/core/base.controller");
        expect(() => Base.parseIdParameter({} as unknown as H3Event)).toThrow();
    });

    test("should return a correct id", async () => {
        const id = "2222222222222222";
        vi.doMock("h3", () => {
            return {
                getRouterParam: () => id,
            };
        });
        const { default: Base } = await import("~~/server/features/core/base.controller");
        expect(Base.parseIdParameter({} as unknown as H3Event)).toBe(id);
    });
});

describe("parseRequestBody", () => {
    const schema = z.string();
    test("should throw an error if the body doesn't match the schema", async () => {
        const { default: Base } = await import("~~/server/features/core/base.controller");
        await expect(Base.parseRequestBody({} as unknown as H3Event, schema)).rejects.toThrow();
    });

    test("should return the parsed body if it matches the schema", async () => {
        const body = "bananas";
        vi.doMock("h3", () => {
            return {
                parseCookies: () => ({}),
                readBody: () => body,
            };
        });
        const { default: Base } = await import("~~/server/features/core/base.controller");
        await expect(Base.parseRequestBody({} as unknown as H3Event, schema)).resolves.toBe(body);
    });

    test.each([
        {
            title: "defaults to the English zod locale",
            cookies: {},
            message: "Invalid input: expected string, received object",
        },
        {
            title: "reads the locale from the cookies",
            cookies: { i18n_redirected: "de" },
            message: "Ungültige Eingabe: erwartet string, erhalten object",
        },
    ])("$title", async ({ cookies, message }) => {
        vi.doMock("h3", () => {
            return {
                parseCookies: () => cookies,
                readBody: () => ({ data: 1 }),
            };
        });
        const { default: Base } = await import("~~/server/features/core/base.controller");
        expect(Base.parseRequestBody({} as unknown as H3Event<EventHandlerRequest>, schema)).rejects.toMatchObject({
            issues: [
                {
                    code: "invalid_type",
                    expected: "string",
                    message,
                    path: [],
                },
            ],
        });
    });
});

describe("mapDomainResultToHttp", () => {
    test.each([
        { event: { method: "GET" }, msg: "OK", code: 200 },
        { event: { method: "POST" }, msg: "Created", code: 201 },
        { event: { method: "PATCH" }, msg: "No Content", code: 204 },
        { event: { method: "PUT" }, msg: "No Content", code: 204 },
    ] as const)(
        "should set the response status to $code - $msg when method is $method and error is null",
        async ({ event, code, msg }) => {
            BaseController.mapDomainResultToHttp(event as never, null);
            expect(setResponseStatusSpy).toHaveBeenCalledExactlyOnceWith(event, code, msg);
        },
    );

    test.each([
        {
            error: new DomainError("A", "B"),
            errorType: "Error",
            message: `Internal Server Error | ${id}`,
            serverMessage: `${id} - DomainError: B`,
            code: 500,
            msg: "Internal Server Error",
        },
        {
            error: new NotFoundError("A", "B"),
            errorType: "NotFoundError",
            message: `A | ${id}`,
            serverMessage: `${id} - NotFoundError: B`,
            code: 404,
            msg: "Not Found",
        },
        {
            error: zodError,
            errorType: "ZodError",
            message: `✖ Invalid input: expected string, received number | ${id}`,
            serverMessage: `${id} - ${JSON.stringify(
                [
                    {
                        expected: "string",
                        code: "invalid_type",
                        path: [],
                        message: "Invalid input: expected string, received number",
                    },
                ],
                null,
                2,
            )}`,
            code: 400,
            msg: "Bad Request",
        },
    ] as const)(
        "should throw a $code error when an error of type $errorType was passed and log something else on the server",
        async ({ error, message, serverMessage, code, msg }) => {
            expect(() => BaseController.mapDomainResultToHttp({ method: "GET" } as never, error)).toThrow(
                expect.objectContaining({
                    statusCode: code,
                    statusMessage: msg,
                    message,
                }),
            );
            expect(createErrorSpy).toHaveBeenCalledExactlyOnceWith({
                statusCode: code,
                statusMessage: msg,
                message,
            });
            expect(consoleErrorMock).toHaveBeenCalledExactlyOnceWith(serverMessage);
        },
    );
});
