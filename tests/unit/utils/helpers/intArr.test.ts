import { intArr } from "@@/tests/utils/helpers";
import { expect, test } from "vitest";

test.each([
    { min: 0, max: 1, length: 0, expected: [] },
    { min: 0, max: 1, length: 5, expected: [1, 0, 0, 0, 0] },
    { min: 0, max: 1, length: 5, seed: 1, expected: [0, 0, 0, 0, 1] },
    { min: 500, max: 1000, length: 5, expected: [683, 554, 810, 767, 953] },
    { min: 500, max: 1000, length: 5, seed: 1, expected: [554, 810, 767, 953, 965] },
])("returns $expected given the range $min - $max and length $length", options => {
    const { expected } = options;
    expect(intArr(options)).toStrictEqual(expected);
});
