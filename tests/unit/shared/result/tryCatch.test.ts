import { tryCatch } from "@@/shared/utils/result";
import { expect, test } from "vitest";

test("should catch errors and return them as a value", async () => {
    const { error, data } = await tryCatch(Promise.reject());
    expect(error).not.toBeNull();
    expect(data).toBeNull();
});

test("should return the resolved promise value", async () => {
    const { error, data } = await tryCatch(Promise.resolve(42));
    expect(error).toBeNull();
    expect(data).toBe(42);
});
