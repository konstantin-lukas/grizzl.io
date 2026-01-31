import { strArr } from "@@/tests/utils/helpers";
import { expect, test } from "vitest";

test.each([
    { title: "return an empty array when length is 0", arrLength: 0, expected: [] },
    {
        title: "return the same as the str function would but wrapped in an array",
        arrLength: 1,
        expected: ["Vitae lobortis pellentesque tortor volutpat aliqu."],
    },
    {
        title: "return pseudo-randomly selected values",
        arrLength: 3,
        expected: [
            "Vitae lobortis pellentesque tortor volutpat aliqu.",
            "Lobortis pellentesque tortor volutpat aliquam lec.",
            "Pellentesque tortor volutpat aliquam lectus vivam.",
        ],
    },
    {
        title: "return potentially duplicate values",
        arrLength: 5,
        strLength: 1,
        words: ["a", "b", "c", "d", "e"],
        expected: ["B", "D", "A", "B", "B"],
    },
    {
        title: "not return duplicates when options.unique is set to true",
        arrLength: 5,
        strLength: 1,
        unique: true,
        words: ["a", "b", "c", "d", "e"],
        expected: ["B", "D", "A", "E", "C"],
    },
])("should $title", ({ expected, ...options }) => {
    expect(strArr(options)).toEqual(expected);
});
