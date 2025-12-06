import { tryThrow } from "@@/server/utils/result";
import { expect, test, vi } from "vitest";

const { throwError } = vi.hoisted(() => {
    return {
        throwError: vi.fn().mockImplementation(value => {
            throw value;
        }),
    };
});

vi.mock("~~/server/utils/http", () => {
    return {
        throwError,
    };
});

const data = "bananas";

test("should return the data when there is no error", async () => {
    await expect(tryThrow(Promise.resolve(data))).resolves.toBe(data);
});

test("should throw a generic error and log it", async () => {
    await expect(tryThrow(Promise.reject(data))).rejects.toBe(data);
    expect(throwError).toHaveBeenCalledWith(data, "UNPROCESSABLE_CONTENT", true);
});
