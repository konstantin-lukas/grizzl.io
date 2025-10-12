import { tryCatch } from "@@/app/utils/result";
import { expect, it } from "vitest";

it("should catch errors and return them as a value", async () => {
    const { error, data } = await tryCatch(Promise.reject());
    expect(error).not.toBeNull();
    expect(data).toBeNull();
});

it("should catch errors and return them as a value", async () => {
    const { error, data } = await tryCatch(Promise.resolve(42));
    expect(error).toBeNull();
    expect(data).toBe(42);
});
