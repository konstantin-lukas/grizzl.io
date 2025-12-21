import type { H3Event } from "h3";
import { beforeEach, expect, test, vi } from "vitest";

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
    const { parseIdParameter } = await import("@@/server/utils/schema");
    await expect(parseIdParameter({} as unknown as H3Event)).rejects.toThrow();
});

test("should return a correct id", async () => {
    const id = "2222222222222222";
    vi.doMock("h3", () => {
        return {
            getRouterParam: () => id,
        };
    });
    const { parseIdParameter } = await import("@@/server/utils/schema");
    await expect(parseIdParameter({} as unknown as H3Event)).resolves.toBe(id);
});
