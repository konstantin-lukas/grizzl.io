import { filterMap } from "#shared/core/utils/array.util";
import { expect, test } from "vitest";

test("allows removing items by returning undefined", () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const expected = [2, 4, 6, 8, 10];
    const result = filterMap(array, n => (n % 2 === 0 ? n : undefined));
    expect(result).toEqual(expected);
});

test("allows mapping items", () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const expected = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
    const result = filterMap(array, n => 2 * n);
    expect(result).toEqual(expected);
});

test("allows filtering and mapping items simultaneously", () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const expected = [4, 8, 12, 16, 20];
    const result = filterMap(array, n => (n % 2 === 0 ? 2 * n : undefined));
    expect(result).toEqual(expected);
});
