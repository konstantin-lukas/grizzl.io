import { request } from "@@/shared/utils/request";
import { expect, it } from "vitest";

it("should catch errors and return them as a value", async () => {
    const { error, data } = await request(Promise.reject());
    expect(error).not.toBeNull();
    expect(data).toBeNull();
});

it("should catch errors and return them as a value", async () => {
    const { error, data } = await request(Promise.resolve(42));
    expect(error).toBeNull();
    expect(data).toBe(42);
});
