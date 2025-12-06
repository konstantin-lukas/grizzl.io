import { throwError } from "@@/server/utils/http";
import { HTTP_CODES } from "@@/tests/constants/http";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, expect, test, vi } from "vitest";
import { z } from "zod";

const { createErrorSpy } = vi.hoisted(() => {
    return {
        createErrorSpy: vi.fn().mockImplementation(value => value),
    };
});
const consoleErrorMock = vi.spyOn(console, "error").mockImplementation(value => value);
const consoleLogMock = vi.spyOn(console, "log").mockImplementation(value => value);
mockNuxtImport("createError", () => {
    return createErrorSpy;
});

beforeEach(() => {
    vi.resetAllMocks();
});

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
    expect(() => throwError(error)).toThrow();
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

test.each(HTTP_CODES)("should throw an error with the correct status code and message", (code, key, message) => {
    expect(() => throwError(errorMessage, key)).toThrow();
    expect(createErrorSpy).toHaveBeenCalledWith({
        statusCode: code,
        statusMessage: message,
        message: errorMessage,
    });
});

test("should allow overriding the returned error message with the http status message", () => {
    expect(() => throwError(errorMessage, "I_AM_A_TEAPOT", true)).toThrow();
    expect(createErrorSpy).toHaveBeenCalledWith({
        statusCode: 418,
        statusMessage: "I'm a Teapot",
        message: "I'm a Teapot",
    });
});
