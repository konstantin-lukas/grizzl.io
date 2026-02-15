import { ellipsize } from "#shared/utils/string.util";
import { expect, test } from "vitest";

test.each([
    { name: "should return an empty string with max 0", text: "", max: 0, expected: "" },
    { name: "should return an empty string with max greater than 0", text: "", max: 1, expected: "" },
    { name: "should return the string if it the same length as max", text: "short", max: 5, expected: "short" },
    { name: "should return the string if it is shorter than max", text: "short", max: 10, expected: "short" },
    {
        name: "should truncate the string and add an ellipsis if it is on charater longer than max",
        text: "short",
        max: 4,
        expected: "shor…",
    },
    {
        name: "should truncate the string and add an ellipsis if it is longer than max",
        text: "quite verbose",
        max: 10,
        expected: "quite verb…",
    },
])("$name", ({ text, max, expected }) => {
    expect(ellipsize(text, max)).toBe(expected);
});
