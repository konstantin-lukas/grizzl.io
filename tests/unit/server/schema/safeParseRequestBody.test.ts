import type { EventHandlerRequest, H3Event } from "h3";
import { beforeEach, expect, test, vi } from "vitest";
import { z } from "zod";

const schema = z.string();

beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
});

test("should default to the English zod locale", async () => {
    vi.doMock("h3", () => {
        return {
            parseCookies: () => ({}),
            readBody: () => ({ data: 1 }),
        };
    });
    const { safeParseRequestBody } = await import("@@/server/utils/schema");
    const { data, success, error } = await safeParseRequestBody({} as unknown as H3Event<EventHandlerRequest>, schema);
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
    const { safeParseRequestBody } = await import("@@/server/utils/schema");
    const { data, success, error } = await safeParseRequestBody({} as unknown as H3Event<EventHandlerRequest>, schema);
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
    const { safeParseRequestBody } = await import("@@/server/utils/schema");
    const { data, success, error } = await safeParseRequestBody({} as unknown as H3Event<EventHandlerRequest>, schema);
    expect(success).toBe(true);
    expect(data).toBe(body);
    expect(error).toBeUndefined();
});
