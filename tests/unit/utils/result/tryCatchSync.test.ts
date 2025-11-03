import { tryCatchSync } from "@@/shared/utils/result";
import { expect, it } from "vitest";

it("should catch errors and return them as a value", () => {
    const { error, data } = tryCatchSync(() => {
        throw new Error();
    });
    expect(error).not.toBeNull();
    expect(data).toBeNull();
});

it("should catch errors and return them as a value", () => {
    const { error, data } = tryCatchSync(() => {
        return 42;
    });
    expect(error).toBeNull();
    expect(data).toBe(42);
});
