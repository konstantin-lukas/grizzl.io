import { arr } from "@@/tests/utils/helpers";
import { expect, test } from "vitest";

const fruit = ["Apples", "Oranges", "Bananas", "Strawberries"];

test.each([
    {
        title: "return an array of three elements by default",
        source: "Apples",
        expected: ["Apples", "Apples", "Apples"],
    },
    { title: "return an empty array when length is 0", source: "Apples", length: 0, expected: [] },
    {
        title: "return an array with a single element when the length is 1",
        source: "Apples",
        length: 1,
        expected: ["Apples"],
    },
    {
        title: "return an array with the same element twice when the source is a string",
        source: "Apples",
        length: 2,
        expected: ["Apples", "Apples"],
    },
    {
        title: "return an array with the same element twice when the source is a number",
        source: 42,
        length: 2,
        expected: [42, 42],
    },
    {
        title: "return an array of indexes when the source is the identity function of the index",
        source: (index: number) => index,
        length: undefined,
        expected: [0, 1, 2],
    },
    {
        title: "return an array of the same elements if the source is an array of length 1",
        source: ["Apples"],
        expected: ["Apples", "Apples", "Apples"],
    },
    {
        title: "return elements from the provided source array",
        source: fruit,
        expected: ["Bananas", "Bananas", "Oranges"],
    },
    {
        title: "only return unique values when the unique option is set",
        source: fruit,
        unique: true,
        expected: ["Bananas", "Oranges", "Strawberries"],
    },
])("should $title", ({ expected, source, length, unique }) => {
    expect(arr(source, { length, unique })).toEqual(expected);
});

test.each([
    {
        title: "the source is a single value but the length is greater than one",
        source: "Oranges",
    },
    {
        title: "the source is a is an array that contains fewer elements than the required length",
        source: ["Oranges"],
    },
    {
        title: "the source is a is a function that doesn't return enough unique values",
        source: () => "Oranges",
    },
])("should throw an error when options.unique is true and $title", ({ source }) => {
    expect(() => arr(source, { length: 2, unique: true })).toThrow(
        new Error("Too many iteration reached trying to generate unique values."),
    );
});

test("should allow creating an array of objects", () => {
    expect(arr(i => ({ i }))).toStrictEqual([{ i: 0 }, { i: 1 }, { i: 2 }]);
});

test("should allow creating an array of unique objects", () => {
    expect(arr(i => ({ i: Math.floor(i / 2) }), { unique: ({ i }) => i })).toStrictEqual([
        { i: 0 },
        { i: 1 },
        { i: 2 },
    ]);
});

test("should throw an error when options.unique doesn't return enough unique values", () => {
    expect(() => arr(() => ({ i: 0 }), { length: 2, unique: () => 0 })).toThrow(
        new Error("Too many iterations reached trying to generate unique values."),
    );
});
