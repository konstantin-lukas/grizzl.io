import { deleteNthElement } from "@@/shared/utils/array";
import { expect, test } from "vitest";

test.each([
    {
        name: "middle element",
        array: [1, 2, 3, 4],
        n: 1,
        expected: [1, 3, 4],
    },
    {
        name: "first element",
        array: [1, 2, 3],
        n: 0,
        expected: [2, 3],
    },
    {
        name: "last element",
        array: [1, 2, 3],
        n: 2,
        expected: [1, 2],
    },
    {
        name: "n out of bounds (negative)",
        array: [1, 2, 3],
        n: -1,
        expected: [1, 2, 3],
    },
    {
        name: "n out of bounds (too large)",
        array: [1, 2, 3],
        n: 5,
        expected: [1, 2, 3],
    },
    {
        name: "empty array",
        array: [],
        n: 0,
        expected: [],
    },
    {
        name: "first on one-tuple",
        array: [42],
        n: 0,
        expected: [],
    },
    {
        name: "array with objects",
        array: [{ a: 1 }, { b: 2 }, { c: 3 }],
        n: 1,
        expected: [{ a: 1 }, { c: 3 }],
    },
])("should delete: $name", ({ array, n, expected }) => {
    const result = deleteNthElement<unknown>(array, n);
    expect(result).toEqual(expected);
    expect(result).not.toBe(array);
});
