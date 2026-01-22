import { str } from "@@/tests/utils/helpers";
import { expect, test } from "vitest";

const testCases = [
    { title: "", length: 0, expected: "" },
    { title: "", length: 1, expected: "L" },
    { title: "", length: undefined, expected: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    {
        title: "and rotate is one",
        length: 6,
        rotate: 1,
        expected: "Sed do",
    },
    {
        title: "and rotate is 25",
        length: undefined,
        rotate: 25,
        expected: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    { title: "and no base is provided", length: 6, expected: "LoremL" },
    { title: "and spaces are allowed", length: 18, spaces: "yes", expected: "Lorem ipsum dolor " },
    {
        title: "and trailing whitespace is disallowed",
        length: 18,
        spaces: "noTrailingSpace",
        expected: "Lorem ipsum dolorL",
    },
    { title: "and whitespace is disallowed", length: 18, spaces: "no", expected: "Loremipsumdolorsit" },
    {
        title: "and whitespace is disallowed given a base containing special whitespace characters",
        length: 5,
        base: "a\nb\tc",
        spaces: "no",
        expected: "abcab",
    },
    {
        title: "and trailing whitespace is disallowed given a base containing special whitespace characters",
        length: 2,
        base: "a\n",
        spaces: "noTrailingSpace",
        expected: "aa",
    },
    {
        title: "and sentences were rotated",
        length: 2,
        base: "a\n",
        spaces: "noTrailingSpace",
        expected: "aa",
    },
] as const;

test.each(testCases)("should return $expected when length is $length $title", ({ expected, title: _, ...options }) => {
    expect(str(options)).toEqual(expected);
});
