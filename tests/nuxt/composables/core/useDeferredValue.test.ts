import { beforeEach, expect, test, vi } from "vitest";
import { ref } from "vue";
import useDeferredValue from "~/core/composables/useDeferredValue";
import { withSetup } from "~~/test-utils/helpers/nuxt";

beforeEach(() => {
    vi.useFakeTimers();
});

test("returns the source value initially", async () => {
    const source = ref("apple");

    const { composable } = await withSetup(() => useDeferredValue(source, 300));

    expect(composable.value).toBe("apple");
});

test("defers writing changes back to the source", async () => {
    const source = ref("apple");

    const { composable } = await withSetup(() => useDeferredValue(source, 300));

    composable.value = "banana";

    expect(source.value).toBe("apple");

    vi.advanceTimersByTime(299);
    expect(source.value).toBe("apple");

    vi.advanceTimersByTime(1);
    await vi.waitFor(() => {
        expect(source.value).toBe("banana");
    });
});

test("only writes the latest value after rapid changes", async () => {
    const source = ref("apple");

    const { composable } = await withSetup(() => useDeferredValue(source, 300));

    composable.value = "banana";
    vi.advanceTimersByTime(100);

    composable.value = "cherry";
    vi.advanceTimersByTime(100);

    composable.value = "date";
    vi.advanceTimersByTime(299);

    expect(source.value).toBe("apple");

    vi.advanceTimersByTime(1);
    await vi.waitFor(() => {
        expect(source.value).toBe("date");
    });
});

test("updates the local value immediately when the source changes externally", async () => {
    const source = ref("apple");

    const { composable, wrapper } = await withSetup(() => useDeferredValue(source, 300));

    source.value = "banana";
    await wrapper.vm.$nextTick();

    expect(composable.value).toBe("banana");
});

test("cancels a pending write when the source changes externally", async () => {
    const source = ref("apple");

    const { composable, wrapper } = await withSetup(() => useDeferredValue(source, 300));

    composable.value = "banana";
    vi.advanceTimersByTime(100);

    source.value = "cherry";
    await wrapper.vm.$nextTick();

    vi.advanceTimersByTime(300);

    expect(source.value).toBe("cherry");
    expect(composable.value).toBe("cherry");
});

test("cleans up pending timers on unmount", async () => {
    const source = ref("apple");

    const { composable, wrapper } = await withSetup(() => useDeferredValue(source, 300));

    composable.value = "banana";
    wrapper.unmount();

    vi.advanceTimersByTime(300);

    expect(source.value).toBe("apple");
});
