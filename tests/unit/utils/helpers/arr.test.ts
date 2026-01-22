import { arr } from "@@/tests/utils/helpers";
import { expect, test } from "vitest";

const testCases = [
    { title: "3 by default", source: "Apples", length: undefined, expected: ["Apples", "Apples", "Apples"] },
    { title: "0 when length is zero", source: "Apples", length: 0, expected: [] },
    { title: "1 when length is one", source: "Apples", length: 1, expected: ["Apples"] },
    { title: "2 when length is two", source: "Apples", length: 2, expected: ["Apples", "Apples"] },
    {
        title: "3 given generated values when the source is a callback",
        source: (index: number) => (index + 1).toString(),
        length: undefined,
        expected: ["1", "2", "3"],
    },
] as const;

test.each(testCases)("should return an array of length $length", ({ expected, source, length }) => {
    expect(arr(source, { length })).toEqual(expected);
});
