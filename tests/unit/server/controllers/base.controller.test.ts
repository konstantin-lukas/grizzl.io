import BaseController from "@@/server/controllers/base.controller";
import { HTTP_CODES } from "@@/tests/constants/http";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import type { EventHandlerRequest, H3Event } from "h3";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { z } from "zod";
import NotFoundError from "~~/server/errors/not-found-error";

const { setResponseStatusSpy } = vi.hoisted(() => {
    return {
        setResponseStatusSpy: vi.fn(),
    };
});

mockNuxtImport("setResponseStatus", () => {
    return setResponseStatusSpy;
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

describe("setStatus", () => {
    test.each(HTTP_CODES)(
        "should call setResponseStatus with the correct status message for %s",
        (code, key, message) => {
            BaseController.setStatus({} as unknown as H3Event<EventHandlerRequest>, key);
            expect(setResponseStatusSpy).toHaveBeenCalledOnce();
            expect(setResponseStatusSpy).toHaveBeenCalledWith({}, code, message);
        },
    );

    test("defaults to setting status to 200", () => {
        BaseController.setStatus({} as unknown as H3Event<EventHandlerRequest>);
        expect(setResponseStatusSpy).toHaveBeenCalledOnce();
        expect(setResponseStatusSpy).toHaveBeenCalledWith({}, 200, "OK");
    });
});

describe("throwError", () => {
    const errorMessage = "Oh no!";

    test.each([
        {
            name: "should log a string to the console and return it as the message",
            error: errorMessage,
            expected: errorMessage,
        },
        {
            name: "should log an error to the console and return its message",
            error: new Error(errorMessage),
            expected: errorMessage,
        },
        {
            name: "should log a zod error to the console and return it prettified",
            error: z.string().safeParse(0).error!,
            expected: "✖ Invalid input: expected string, received number",
        },
    ])("$name", ({ error, expected }) => {
        expect(() => BaseController.throwError(error)).toThrow();
        expect(consoleErrorMock).toHaveBeenCalledOnce();
        expect(consoleErrorMock).toHaveBeenCalledWith(error);
        expect(consoleLogMock).not.toHaveBeenCalled();
        expect(createErrorSpy).toHaveBeenCalledOnce();
        expect(createErrorSpy).toHaveBeenCalledWith({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: expected,
        });
    });

    test.each(HTTP_CODES)(
        "should throw an error with the correct status code and message for %s",
        (code, key, message) => {
            expect(() => BaseController.throwError(errorMessage, key)).toThrow();
            expect(createErrorSpy).toHaveBeenCalledWith({
                statusCode: code,
                statusMessage: message,
                message: errorMessage,
            });
        },
    );

    test("should allow overriding the returned error message with the http status message", () => {
        expect(() => BaseController.throwError(errorMessage, "I_AM_A_TEAPOT", true)).toThrow();
        expect(createErrorSpy).toHaveBeenCalledWith({
            statusCode: 418,
            statusMessage: "I'm a Teapot",
            message: "I'm a Teapot",
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
        const { default: Base } = await import("@@/server/controllers/base.controller");
        expect(() => Base.parseIdParameter({} as unknown as H3Event)).toThrow();
    });

    test("should return a correct id", async () => {
        const id = "2222222222222222";
        vi.doMock("h3", () => {
            return {
                getRouterParam: () => id,
            };
        });
        const { default: Base } = await import("@@/server/controllers/base.controller");
        expect(Base.parseIdParameter({} as unknown as H3Event)).toBe(id);
    });
});

describe("parseRequestBody", () => {
    const schema = z.string();
    test("should throw an error if the body doesn't match the schema", async () => {
        const { default: Base } = await import("@@/server/controllers/base.controller");
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
        const { default: Base } = await import("@@/server/controllers/base.controller");
        await expect(Base.parseRequestBody({} as unknown as H3Event, schema)).resolves.toBe(body);
    });
});

describe("safeParseRequestBody", () => {
    const schema = z.string();

    test("should default to the English zod locale", async () => {
        vi.doMock("h3", () => {
            return {
                parseCookies: () => ({}),
                readBody: () => ({ data: 1 }),
            };
        });
        const { default: Base } = await import("@@/server/controllers/base.controller");
        const { data, success, error } = await Base.safeParseRequestBody(
            {} as unknown as H3Event<EventHandlerRequest>,
            schema,
        );
        expect(success).toBe(false);
        expect(data).toBeUndefined();
        expect(error?.issues[0]!.message).toBe("Invalid input: expected string, received object");
    });

    test("should read the locale from the cookies", async () => {
        vi.doMock("h3", () => {
            return {
                parseCookies: () => ({ i18n_redirected: "de" }),
                readBody: () => ({ data: 1 }),
            };
        });
        const { default: Base } = await import("@@/server/controllers/base.controller");
        const { data, success, error } = await Base.safeParseRequestBody(
            {} as unknown as H3Event<EventHandlerRequest>,
            schema,
        );
        expect(success).toBe(false);
        expect(data).toBeUndefined();
        expect(error?.issues[0]!.message).toBe("Ungültige Eingabe: erwartet string, erhalten object");
    });

    test("should normally parse the body when there are no issues", async () => {
        const body = "bananas";

        vi.doMock("h3", () => {
            return {
                parseCookies: () => ({}),
                readBody: () => body,
            };
        });
        const { default: Base } = await import("@@/server/controllers/base.controller");
        const { data, success, error } = await Base.safeParseRequestBody(
            {} as unknown as H3Event<EventHandlerRequest>,
            schema,
        );
        expect(success).toBe(true);
        expect(data).toBe(body);
        expect(error).toBeUndefined();
    });
});

describe("inferResponse", () => {
    test.each([
        { event: { method: "GET" }, msg: "OK", code: 200 },
        { event: { method: "POST" }, msg: "Created", code: 201 },
        { event: { method: "PATCH" }, msg: "No Content", code: 204 },
        { event: { method: "PUT" }, msg: "No Content", code: 204 },
    ] as const)("should set the response status to $code - $msg when method is $method", ({ event, code, msg }) => {
        BaseController.inferResponse(event as never, { error: null } as never);
        expect(setResponseStatusSpy).toHaveBeenCalledExactlyOnceWith(event, code, msg);
    });

    test.each([
        {
            result: { error: new Error() },
            errorType: "Error",
            expected: "Unprocessable Content",
            code: 422,
            msg: "Unprocessable Content",
        },
        {
            result: { error: new NotFoundError() },
            errorType: "NotFoundError",
            expected: "The provided ID was not found",
            code: 404,
            msg: "Not Found",
        },
    ] as const)(
        "should set the response status to $code when an error of type $errorType was passed",
        ({ result, expected, code, msg }) => {
            expect(() => BaseController.inferResponse({ method: "GET" } as never, result as never)).toThrow(expected);
            expect(createErrorSpy).toHaveBeenCalledExactlyOnceWith({
                statusCode: code,
                statusMessage: msg,
                message: expected,
            });
        },
    );
});
