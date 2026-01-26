import { str } from "@@/tests/utils/helpers";
import { expect, test } from "vitest";

const words = ["the", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"];
test.each([
    { title: "return an empty string when length is zero", length: 0, expected: "" },
    { title: "return the first letter of the first word capitalized when length is one", length: 1, expected: "V" },
    {
        title: "return a string of length 50 by default",
        length: undefined,
        expected: "Vitae lobortis pellentesque tortor volutpat aliqu.",
    },
    { title: "handle sentences that would otherwise end in a space", length: 6, expected: "Vitae." },
    { title: "handle a sentences that would otherwise end in a space and a letter", length: 7, expected: "Vitaei." },
    {
        title: "handle a sentences that would otherwise end in a space and two letters",
        length: 8,
        expected: "Vitaeio.",
    },
    {
        title: "replace the last character with a period before returning the result",
        length: 9,
        expected: "Vitae lo.",
    },
    {
        title: "accept a custom word list",
        expected: "The brown over jumps the quick the lazy dog. Dogi.",
        words,
    },
    {
        title: "return a string only containing lowercase letters when spaces are disabled",
        expected: "vitaelobortispellentesquetortorvolutpataliquamlect",
        spaces: false,
    },
    {
        title: "return a different string when a custom seed is provided",
        seed: 1,
        expected: "Lobortis pellentesque tortor volutpat aliquam lec.",
    },
])("should $title", ({ expected, ...options }) => {
    expect(str(options)).toEqual(expected);
});
