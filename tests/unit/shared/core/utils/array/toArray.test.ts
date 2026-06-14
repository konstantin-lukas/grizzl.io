import { toArray } from "#shared/core/utils/array.util";
import { expect, test } from "vitest";

test("returns the same input value if it is an array", () => {
    const array = [1, 2, 3];
    expect(toArray(array)).toBe(array);
});

test("returns the value wrapped in an array if it isn't already an array", () => {
    expect(toArray(1)).toStrictEqual([1]);
});
