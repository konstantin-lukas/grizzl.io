import { moveElement } from "@@/shared/utils/array";
import { expect, test } from "vitest";

test.each([
    {
        name: "move element forward in array",
        array: [1, 2, 3, 4],
        fromIndex: 1,
        toIndex: 3,
        expected: [1, 3, 4, 2],
    },
    {
        name: "move element backward in array",
        array: [1, 2, 3, 4],
        fromIndex: 3,
        toIndex: 0,
        expected: [4, 1, 2, 3],
    },
    {
        name: "move element to same index",
        array: [1, 2, 3],
        fromIndex: 1,
        toIndex: 1,
        expected: [1, 2, 3],
    },
    {
        name: "fromIndex out of bounds (negative)",
        array: [1, 2, 3],
        fromIndex: -1,
        toIndex: 1,
        expected: [1, 2, 3],
    },
    {
        name: "toIndex out of bounds (negative)",
        array: [1, 2, 3],
        fromIndex: 1,
        toIndex: -1,
        expected: [1, 2, 3],
    },
    {
        name: "fromIndex out of bounds (too large)",
        array: [1, 2, 3],
        fromIndex: 5,
        toIndex: 1,
        expected: [1, 2, 3],
    },
    {
        name: "toIndex out of bounds (too large)",
        array: [1, 2, 3],
        fromIndex: 1,
        toIndex: 5,
        expected: [1, 2, 3],
    },
    {
        name: "empty array",
        array: [],
        fromIndex: 0,
        toIndex: 0,
        expected: [],
    },
    {
        name: "single element array",
        array: [42],
        fromIndex: 0,
        toIndex: 0,
        expected: [42],
    },
])("should move: $name", ({ array, fromIndex, toIndex, expected }) => {
    const result = moveElement(array, fromIndex, toIndex);

    expect(result).toEqual(expected);

    if (array.length > 0) {
        expect(result).not.toBe(array);
    }
});
