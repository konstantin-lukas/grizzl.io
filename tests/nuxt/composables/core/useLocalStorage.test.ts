import { clearNuxtState } from "#app";
import { beforeEach, expect, test, vi } from "vitest";
import useLocalStorage from "~/core/composables/useLocalStorage";
import { withSetup } from "~~/test-utils/helpers/nuxt";

const { localStorageStub } = await vi.hoisted(async () => {
    const localStorageStub = {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
    };
    vi.stubGlobal("localStorage", localStorageStub);
    return { localStorageStub };
});

beforeEach(() => {
    clearNuxtState();
    vi.resetAllMocks();
});

test("returns null when local storage has no value", async () => {
    localStorageStub.getItem.mockReturnValueOnce(null);

    const { composable } = await withSetup(() => useLocalStorage("bananas"));

    await vi.waitFor(() => {
        expect(composable.value).toBeNull();
    });

    expect(localStorageStub.getItem).toHaveBeenCalledWith("bananas");
    expect(localStorageStub.setItem).not.toHaveBeenCalled();
    expect(localStorageStub.removeItem).not.toHaveBeenCalled();
});

test("returns the value from local storage when one exists", async () => {
    localStorageStub.getItem.mockReturnValueOnce("peaches");

    const { composable } = await withSetup(() => useLocalStorage("bananas"));

    await vi.waitFor(() => {
        expect(composable.value).toBe("peaches");
    });
});

test("writes a new value to local storage when updated", async () => {
    localStorageStub.getItem.mockReturnValueOnce(null);

    const { composable } = await withSetup(() => useLocalStorage("bananas"));

    composable.value = "kiwis";

    await vi.waitFor(() => {
        expect(localStorageStub.setItem).toHaveBeenLastCalledWith("bananas", "kiwis");
    });
});

test("removes from local storage when value is set to null", async () => {
    localStorageStub.getItem.mockReturnValueOnce("peaches");

    const { composable } = await withSetup(() => useLocalStorage("bananas"));

    localStorageStub.setItem.mockClear();
    localStorageStub.removeItem.mockClear();

    composable.value = null;

    await vi.waitFor(() => {
        expect(localStorageStub.removeItem).toHaveBeenCalledWith("bananas");
        expect(localStorageStub.setItem).not.toHaveBeenCalled();
    });
});

test("keeps local storage data as raw string (no JSON parsing)", async () => {
    localStorageStub.getItem.mockReturnValueOnce('{"fruit":"oranges"}');

    const { composable } = await withSetup(() => useLocalStorage("bananas"));

    await vi.waitFor(() => {
        expect(composable.value).toBe('{"fruit":"oranges"}');
    });
});
