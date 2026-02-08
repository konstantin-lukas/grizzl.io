import { dateArr } from "@@/test-utils/helpers/data";
import { expect, test } from "vitest";

const firstDate = "2025-01-23T02:17:18.000Z";
const testCases = [
    { title: "an empty array when length is zero", options: { length: 0 }, expected: [] },
    {
        title: "a single element when no options are provided and length is one",
        options: { length: 1 },
        expected: [firstDate],
    },
    {
        title: "a different single element when a custom seed is set and length is one",
        options: { length: 1, seed: 1 },
        expected: ["2025-05-18T01:18:19.000Z"],
    },
    {
        title: "two random dates when no options are provided and length is two",
        options: { length: 2 },
        expected: [firstDate, "2025-05-18T01:18:19.000Z"],
    },
    {
        title: "duplicate days when time span is zero",
        options: { length: 2, days: 0, hours: 0, minutes: 0, seconds: 0 },
        expected: ["2025-06-01T12:00:00.000Z", "2025-06-01T12:00:00.000Z"],
    },
    {
        title: "the custom ref date when one is provided and the time span is zero",
        options: { length: 1, days: 0, hours: 0, minutes: 0, seconds: 0, refDate: "2025-01-01T12:00:00.000Z" },
        expected: ["2025-01-01T12:00:00.000Z"],
    },
] as const;

test.each(testCases)("returns $title", ({ expected, options }) => {
    expect(dateArr(options)).toEqual(expected.map(d => new Date(d)));
});
