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

test("should return the defaultValue by default and write it to local storage", async () => {
    localStorageStub.getItem.mockReturnValueOnce(null);
    const { composable } = await withSetup(() => useLocalStorage("bananas", "oranges"));
    expect(composable.value).toBe("oranges");
    expect(localStorageStub.setItem).toHaveBeenLastCalledWith("bananas", "oranges");
});

test("should return the value from local storage when one exists", async () => {
    localStorageStub.getItem.mockReturnValueOnce("peaches");
    const { composable } = await withSetup(() => useLocalStorage("bananas", "oranges"));
    await vi.waitFor(() => {
        expect(composable.value).toBe("peaches");
    });
});

test("writes the new value to local storage when updated", async () => {
    localStorageStub.getItem.mockReturnValueOnce(null);
    const { composable } = await withSetup(() => useLocalStorage<string>("bananas", "oranges"));
    composable.value = "kiwis";
    await vi.waitFor(() => {
        expect(localStorageStub.setItem).toHaveBeenLastCalledWith("bananas", "kiwis");
    });
});

test("serializes objects and writes them to local storage", async () => {
    localStorageStub.getItem.mockReturnValueOnce(null);
    const { composable } = await withSetup(() => useLocalStorage("bananas", { fruit: "oranges" }));
    await vi.waitFor(() => {
        expect(localStorageStub.setItem).toHaveBeenLastCalledWith("bananas", '{"fruit":"oranges"}');
    });

    composable.value.fruit = "kiwis";
    await vi.waitFor(() => {
        expect(localStorageStub.setItem).toHaveBeenLastCalledWith("bananas", '{"fruit":"kiwis"}');
    });
});

test("handles unparsable data in the local storage", async () => {
    localStorageStub.getItem.mockReturnValueOnce("bananas");
    await withSetup(() => useLocalStorage("bananas", { fruit: "oranges" }));

    await vi.waitFor(() => {
        expect(localStorageStub.removeItem).toHaveBeenCalledExactlyOnceWith("bananas");
        expect(localStorageStub.setItem).toHaveBeenLastCalledWith("bananas", '{"fruit":"oranges"}');
    });
});

test("handles parsable data in the local storage", async () => {
    localStorageStub.getItem.mockReturnValueOnce('{"fruit":"oranges"}');
    const { composable } = await withSetup(() => useLocalStorage("bananas", { fruit: "kiwis" }));

    await vi.waitFor(() => {
        expect(composable.value).toStrictEqual({ fruit: "oranges" });
    });
});
