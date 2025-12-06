import { setStatus } from "@@/server/utils/http";
import { HTTP_CODES } from "@@/tests/constants/http";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import type { EventHandlerRequest, H3Event } from "h3";
import { beforeEach, expect, test, vi } from "vitest";

const { setResponseStatusSpy } = vi.hoisted(() => {
    return {
        setResponseStatusSpy: vi.fn(),
    };
});

mockNuxtImport("setResponseStatus", () => {
    return setResponseStatusSpy;
});

beforeEach(() => {
    vi.resetAllMocks();
});

test.each(HTTP_CODES)("should call setResponseStatus with the correct status message for %s", (code, key, message) => {
    setStatus({} as unknown as H3Event<EventHandlerRequest>, key);
    expect(setResponseStatusSpy).toHaveBeenCalledOnce();
    expect(setResponseStatusSpy).toHaveBeenCalledWith({}, code, message);
});

test("defaults to setting status to 200", () => {
    setStatus({} as unknown as H3Event<EventHandlerRequest>);
    expect(setResponseStatusSpy).toHaveBeenCalledOnce();
    expect(setResponseStatusSpy).toHaveBeenCalledWith({}, 200, "OK");
});
