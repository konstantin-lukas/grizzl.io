import type { H3Event } from "h3";
import { beforeEach, expect, test, vi } from "vitest";
import { z } from "zod";

const { throwError } = vi.hoisted(() => {
    return {
        throwError: vi.fn().mockImplementation(value => {
            throw value;
        }),
    };
});

vi.mock("~~/server/utils/http", () => {
    return {
        throwError,
    };
});

beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
});

const schema = z.string();
test("should throw an error if the body doesn't match the schema", async () => {
    const { parseRequestBody } = await import("@@/server/utils/schema");
    await expect(parseRequestBody({} as unknown as H3Event, schema)).rejects.toThrow();
});

test("should return the parsed body if it matches the schema", async () => {
    const body = "bananas";
    vi.doMock("h3", () => {
        return {
            parseCookies: () => ({}),
            readBody: () => body,
        };
    });
    const { parseRequestBody } = await import("@@/server/utils/schema");
    await expect(parseRequestBody({} as unknown as H3Event, schema)).resolves.toBe(body);
});
