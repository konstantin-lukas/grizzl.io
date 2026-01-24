import { int } from "@@/tests/utils/helpers";
import { expect, test } from "vitest";

test.each([
    { min: 0, max: 1, seed: 0, expected: 1 },
    { min: 0, max: 1, seed: 1, expected: 0 },
    { min: 0, max: 1, seed: 2, expected: 0 },
    { min: 0, max: 1, seed: 3, expected: 0 },
    { min: 0, max: 1, seed: 4, expected: 0 },
    { min: 0, max: 1, seed: 5, expected: 1 },
    { min: 100, max: 1000, seed: 0, expected: 234 },
    { min: 100, max: 1000, seed: 1, expected: 434 },
    { min: 100, max: 1000, seed: 2, expected: 426 },
    { min: 100, max: 1000, seed: 3, expected: 245 },
    { min: 100, max: 1000, seed: 4, expected: 223 },
    { min: 100, max: 1000, seed: 5, expected: 937 },
    { min: 100, max: 1000, seed: 6, expected: 372 },
    { min: 100, max: 1000, seed: 7, expected: 681 },
    { min: 100, max: 1000, seed: 8, expected: 755 },
    { min: 100, max: 1000, seed: 9, expected: 174 },
])("returns $expected given the range $min - $max and seed $seed", ({ min, max, seed, expected }) => {
    expect(int({ min, max, seed })).toBe(expected);
});

test.each([
    { title: "min is not an integer", min: 0.1, max: 1, seed: 0 },
    { title: "max is not an integer", min: 0, max: 1.1, seed: 0 },
    { title: "seed is not an integer", min: 0, max: 1, seed: 0.1 },
    { title: "min is not a number", min: NaN, max: 1, seed: 0 },
    { title: "max is not a number", min: 0, max: NaN, seed: 0 },
    { title: "seed is not a number", min: 0, max: 1, seed: NaN },
    { title: "max is smaller than mini", min: 1, max: 0, seed: 0 },
])("throws an error if $title is not an integer", ({ min, max, seed }) => {
    expect(() => int({ min, max, seed })).toThrow();
});
