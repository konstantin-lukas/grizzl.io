import useOnlineStatus from "@@/app/composables/useOnlineStatus";
import { withSetup } from "@@/tests/utils/nuxt";
import { clearNuxtState } from "nuxt/app";
import { beforeEach, expect, test, vi } from "vitest";

beforeEach(() => {
    clearNuxtState();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.useFakeTimers();
    vi.stubGlobal("navigator", { onLine: true });
});

test("returns a state ref defaulting to true", async () => {
    const { composable } = await withSetup(() => useOnlineStatus());
    expect(composable.value).toBe(true);
});

test("polls navigator.onLine every 1000ms and updates the ref", async () => {
    vi.unstubAllGlobals();
    vi.stubGlobal("navigator", {} as Navigator);

    const online = { value: true };
    Object.defineProperty(navigator, "onLine", {
        configurable: true,
        get: () => online.value,
    });

    const { composable, wrapper } = await withSetup(() => useOnlineStatus());

    expect(composable.value).toBe(true);

    online.value = false;
    vi.advanceTimersByTime(1000);
    await wrapper.vm.$nextTick();
    expect(composable.value).toBe(false);

    online.value = true;
    vi.advanceTimersByTime(1000);
    await wrapper.vm.$nextTick();
    expect(composable.value).toBe(true);
});

test("creates only one interval across multiple instances", async () => {
    const setIntervalSpy = vi.spyOn(globalThis, "setInterval");

    await withSetup(() => useOnlineStatus());
    await withSetup(() => useOnlineStatus());

    expect(setIntervalSpy).toHaveBeenCalledTimes(1);
});

test("cleans up the interval only after the last instance unmounts", async () => {
    const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");

    const { wrapper: a } = await withSetup(() => useOnlineStatus());
    const { wrapper: b } = await withSetup(() => useOnlineStatus());

    a.unmount();
    expect(clearIntervalSpy).toHaveBeenCalledTimes(0);

    b.unmount();
    expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
});

test("stops updating after unmount", async () => {
    vi.unstubAllGlobals();
    vi.stubGlobal("navigator", {} as Navigator);

    const online = { value: true };
    Object.defineProperty(navigator, "onLine", {
        configurable: true,
        get: () => online.value,
    });

    const { composable, wrapper } = await withSetup(() => useOnlineStatus());

    expect(composable.value).toBe(true);

    wrapper.unmount();
    online.value = false;
    vi.advanceTimersByTime(1000);
    await wrapper.vm.$nextTick();
    expect(composable.value).toBe(true);
});
