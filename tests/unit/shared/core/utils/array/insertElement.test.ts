import { insertElement } from "#shared/core/utils/array.util";
import { expect, test } from "vitest";

test.each([
    {
        title: "allows inserting an element at the first position",
        array: [1, 2, 3],
        element: 0,
        n: 0,
        expected: [0, 1, 2, 3],
    },
    {
        title: "allows inserting an element at the last position",
        array: [1, 2, 3],
        element: 4,
        n: 3,
        expected: [1, 2, 3, 4],
    },
    {
        title: "allows inserting an element in the middle",
        array: [1, 3],
        element: 2,
        n: 1,
        expected: [1, 2, 3],
    },
    {
        title: "returns a copy of the original array if the index is too small",
        array: [1, 2, 3],
        element: 0,
        n: -1,
        expected: [1, 2, 3],
    },
    {
        title: "returns a copy of the original array if the index is too large",
        array: [1, 2, 3],
        element: 0,
        n: 4,
        expected: [1, 2, 3],
    },
])("$title", ({ array, element, n, expected }) => {
    const result = insertElement(array, element, n);
    expect(result).toEqual(expected);
    expect(result).not.toBe(array);
});
