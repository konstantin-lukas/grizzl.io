import { beforeEach, expect, test, vi } from "vitest";
import { nextTick } from "vue";
import { useScreenSize } from "~/core/composables/useScreenSize";
import { withSetup } from "~~/test-utils/helpers/nuxt";

function setWindowSize(width: number, height: number) {
    Object.defineProperty(window, "innerWidth", {
        configurable: true,
        writable: true,
        value: width,
    });

    Object.defineProperty(window, "innerHeight", {
        configurable: true,
        writable: true,
        value: height,
    });
}

beforeEach(() => {
    vi.restoreAllMocks();
    setWindowSize(1024, 768);
});

test("returns the current screen size and whether the screen is small-or-larger", async () => {
    const { composable } = await withSetup(() => useScreenSize());

    expect(composable.width.value).toBe(1024);
    expect(composable.height.value).toBe(768);
    expect(composable.sm.value).toBe(true);
});

test("updates width, height, and sm when the window is resized", async () => {
    const { composable } = await withSetup(() => useScreenSize());

    setWindowSize(500, 900);
    window.dispatchEvent(new Event("resize"));
    await nextTick();

    expect(composable.width.value).toBe(500);
    expect(composable.height.value).toBe(900);
    expect(composable.sm.value).toBe(false);
});

test("stops updating after unmount", async () => {
    const { composable, wrapper } = await withSetup(() => useScreenSize());

    setWindowSize(700, 800);
    window.dispatchEvent(new Event("resize"));
    await nextTick();

    expect(composable.width.value).toBe(700);
    expect(composable.height.value).toBe(800);
    expect(composable.sm.value).toBe(true);

    wrapper.unmount();

    setWindowSize(300, 400);
    window.dispatchEvent(new Event("resize"));
    await nextTick();

    expect(composable.width.value).toBe(700);
    expect(composable.height.value).toBe(800);
    expect(composable.sm.value).toBe(true);
});
