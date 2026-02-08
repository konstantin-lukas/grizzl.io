import useWakeLock from "@@/app/composables/useWakeLock";
import { beforeEach, expect, test, vi } from "vitest";
import { withSetup } from "~~/test-utils/helpers/nuxt";

let sentinel: {
    release: ReturnType<typeof vi.fn>;
};
let requestMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
    vi.restoreAllMocks();

    sentinel = { release: vi.fn().mockResolvedValue(undefined) };
    requestMock = vi.fn().mockResolvedValue(sentinel);

    vi.stubGlobal("navigator", {
        wakeLock: {
            request: requestMock,
        },
    });

    Object.defineProperty(document, "visibilityState", {
        configurable: true,
        get: () => "visible",
    });
});

test("request() acquires a wake lock and release() releases it", async () => {
    const { composable } = await withSetup(() => useWakeLock());

    await composable.request();

    expect(requestMock).toHaveBeenCalledTimes(1);
    expect(requestMock).toHaveBeenCalledWith("screen");

    await composable.release();

    expect(sentinel.release).toHaveBeenCalledTimes(1);
});

test("request() releases an existing sentinel before requesting a new one", async () => {
    const { composable } = await withSetup(() => useWakeLock());

    await composable.request();
    expect(requestMock).toHaveBeenCalledTimes(1);

    await composable.request();
    expect(sentinel.release).toHaveBeenCalledTimes(1);
    expect(requestMock).toHaveBeenCalledTimes(2);
});

test("visibilitychange re-requests when visible and a sentinel exists", async () => {
    const addSpy = vi.spyOn(document, "addEventListener");
    const removeSpy = vi.spyOn(document, "removeEventListener");

    const { composable, wrapper } = await withSetup(() => useWakeLock());

    expect(addSpy).toHaveBeenCalledWith("visibilitychange", expect.any(Function));
    const listen = addSpy.mock.calls.find(c => c[0] === "visibilitychange")?.[1] as EventListener | undefined;
    expect(listen).toBeTypeOf("function");

    await composable.request();
    const callsBefore = requestMock.mock.calls.length;

    document.dispatchEvent(new Event("visibilitychange"));

    await vi.waitFor(() => {
        expect(sentinel.release).toHaveBeenCalledTimes(1);
        expect(requestMock.mock.calls.length).toBeGreaterThanOrEqual(callsBefore + 1);
    });

    wrapper.unmount();
    expect(removeSpy).toHaveBeenCalledWith("visibilitychange", expect.any(Function));
    expect(sentinel.release).toHaveBeenCalledTimes(2);
});

test("does nothing when the wake lock api is not available", async () => {
    vi.stubGlobal("navigator", {});

    const { composable } = await withSetup(() => useWakeLock());
    await composable.request();
    await composable.release();

    expect(requestMock).not.toHaveBeenCalled();
});

test("only adds event listeners when no wake lock can be acquired", async () => {
    vi.stubGlobal("navigator", {
        wakeLock: {
            request: () => Promise.reject(),
        },
    });

    const addSpy = vi.spyOn(document, "addEventListener");
    const removeSpy = vi.spyOn(document, "removeEventListener");

    const { composable, wrapper } = await withSetup(() => useWakeLock());
    await composable.request();
    await composable.release();

    wrapper.unmount();

    expect(requestMock).not.toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalledOnce();
    expect(removeSpy).toHaveBeenCalledOnce();
});
