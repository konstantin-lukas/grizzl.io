import { str } from "@@/tests/utils/helpers";
import { expect, test } from "vitest";

const testCases = [
    { length: 0, expected: "" },
    { length: 1, expected: "V" },
    { length: undefined, expected: "Vitae lobortis pellentesque tortor volutpat aliqu." },
    { length: 6, expected: "Vitae." },
    { title: "and whitespace is disallowed", length: 18, spaces: false, expected: "vitaelobortispelle" },
] as const;

test.each(testCases)("should return $expected when length is $length", ({ expected, ...options }) => {
    expect(str(options)).toEqual(expected);
});
