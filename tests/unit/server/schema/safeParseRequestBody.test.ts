import { safeParseRequestBody } from "@@/server/utils/schema";
import type { EventHandlerRequest, H3Event } from "h3";
import { expect, test, vi } from "vitest";
import { z } from "zod";

const schema = z.string();
test("should default to the English zod locale", async () => {
    vi.mock("h3", () => {
        return {
            parseCookies: () => ({}),
            readBody: () => ({ data: 1 }),
        };
    });

    const { data, success, error } = await safeParseRequestBody({} as unknown as H3Event<EventHandlerRequest>, schema);
    expect(success).toBe(false);
    expect(data).toBeUndefined();
    expect(error?.issues[0].message).toBe("Invalid input: expected string, received object");
});

test("should read the locale from the cookies", async () => {
    vi.mock("h3", () => {
        return {
            parseCookies: () => ({ i18n_redirected: "de" }),
            readBody: () => ({ data: 1 }),
        };
    });

    const { data, success, error } = await safeParseRequestBody({} as unknown as H3Event<EventHandlerRequest>, schema);
    expect(success).toBe(false);
    expect(data).toBeUndefined();
    expect(error?.issues[0].message).toBe("Invalid input: expected string, received object");
});

test("should normally", async () => {
    const body = "bananas";
    vi.mock("h3", () => {
        return {
            parseCookies: () => ({}),
            readBody: () => body,
        };
    });

    const { data, success, error } = await safeParseRequestBody({} as unknown as H3Event<EventHandlerRequest>, schema);
    expect(success).toBe(true);
    expect(data).toBe(body);
    expect(error).toBeUndefined();
});
