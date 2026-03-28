import { clearNuxtState } from "#app";
import { beforeEach, expect, test, vi } from "vitest";
import useLocalStorage from "~/core/composables/useLocalStorage";

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
    vi.restoreAllMocks();
});

test("should return the defaultValue by default and write it to local storage", () => {
    localStorageStub.getItem.mockReturnValueOnce(null);
    const value = useLocalStorage("bananas", "oranges");
    expect(value.value).toBe("oranges");
    expect(localStorageStub.setItem).toHaveBeenLastCalledWith("bananas", "oranges");
});

test("should return the value from local storage when one exists", async () => {
    localStorageStub.getItem.mockReturnValueOnce("peaches");
    const value = useLocalStorage("bananas", "oranges");
    await vi.waitFor(() => {
        expect(value.value).toBe("peaches");
    });
});

test("writes the new value to local storage when updated", async () => {
    localStorageStub.getItem.mockReturnValueOnce(null);
    const value = useLocalStorage<string>("bananas", "oranges");
    value.value = "kiwis";
    await vi.waitFor(() => {
        expect(localStorageStub.setItem).toHaveBeenLastCalledWith("bananas", "kiwis");
    });
});

test("serializes objects and writes them to local storage", async () => {
    localStorageStub.getItem.mockReturnValueOnce(null);
    const value = useLocalStorage("bananas", { fruit: "oranges" });
    await vi.waitFor(() => {
        expect(localStorageStub.setItem).toHaveBeenLastCalledWith("bananas", '{"fruit":"oranges"}');
    });

    value.value.fruit = "kiwis";
    await vi.waitFor(() => {
        expect(localStorageStub.setItem).toHaveBeenLastCalledWith("bananas", '{"fruit":"kiwis"}');
    });
});

test("handles unparsable data in the local storage", async () => {
    localStorageStub.getItem.mockReturnValueOnce("bananas");
    useLocalStorage("bananas", { fruit: "oranges" });

    await vi.waitFor(() => {
        expect(localStorageStub.removeItem).toHaveBeenCalledExactlyOnceWith("bananas");
        expect(localStorageStub.setItem).toHaveBeenLastCalledWith("bananas", '{"fruit":"oranges"}');
    });
});

test("handles parsable data in the local storage", async () => {
    localStorageStub.getItem.mockReturnValueOnce('{"fruit":"oranges"}');
    const value = useLocalStorage("bananas", { fruit: "kiwis" });

    await vi.waitFor(() => {
        expect(value.value).toStrictEqual({ fruit: "oranges" });
    });
});
