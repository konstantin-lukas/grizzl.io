import { beforeEach, expect, test, vi } from "vitest";
import { ref } from "vue";
import useDeferredSourceValue from "~/core/composables/useDeferredSourceValue";
import { withSetup } from "~~/test-utils/helpers/nuxt";

beforeEach(() => {
    vi.useFakeTimers();
});

test("returns the source value initially", async () => {
    const source = ref("apple");

    const { composable } = await withSetup(() => useDeferredSourceValue(source, 300));

    expect(composable.value).toBe("apple");
});

test("defers updates from source to local value", async () => {
    const source = ref("apple");

    const { composable, wrapper } = await withSetup(() => useDeferredSourceValue(source, 300));

    source.value = "banana";
    await wrapper.vm.$nextTick();

    expect(composable.value).toBe("apple");

    vi.advanceTimersByTime(299);
    expect(composable.value).toBe("apple");

    vi.advanceTimersByTime(1);
    await vi.waitFor(() => {
        expect(composable.value).toBe("banana");
    });
});

test("only applies the latest source value after rapid source changes", async () => {
    const source = ref("apple");

    const { composable, wrapper } = await withSetup(() => useDeferredSourceValue(source, 300));

    source.value = "banana";
    await wrapper.vm.$nextTick();
    vi.advanceTimersByTime(100);

    source.value = "cherry";
    await wrapper.vm.$nextTick();
    vi.advanceTimersByTime(100);

    source.value = "date";
    await wrapper.vm.$nextTick();
    vi.advanceTimersByTime(299);

    expect(composable.value).toBe("apple");

    vi.advanceTimersByTime(1);
    await vi.waitFor(() => {
        expect(composable.value).toBe("date");
    });
});

test("does not write local changes back to the source", async () => {
    const source = ref("apple");

    const { composable } = await withSetup(() => useDeferredSourceValue(source, 300));

    composable.value = "banana";

    vi.advanceTimersByTime(1000);

    expect(source.value).toBe("apple");
    expect(composable.value).toBe("banana");
});

test("cleans up pending timers on unmount", async () => {
    const source = ref("apple");

    const { composable, wrapper } = await withSetup(() => useDeferredSourceValue(source, 300));

    source.value = "banana";
    await wrapper.vm.$nextTick();

    wrapper.unmount();
    vi.advanceTimersByTime(300);

    expect(composable.value).toBe("apple");
});
