import { tryCatchSync } from "@@/shared/utils/result";
import { expect, test } from "vitest";

test("should catch errors and return them as a value", () => {
    const { error, data } = tryCatchSync(() => {
        throw new Error();
    });
    expect(error).not.toBeNull();
    expect(data).toBeNull();
});

test("should return the callback output", () => {
    const { error, data } = tryCatchSync(() => {
        return 42;
    });
    expect(error).toBeNull();
    expect(data).toBe(42);
});
