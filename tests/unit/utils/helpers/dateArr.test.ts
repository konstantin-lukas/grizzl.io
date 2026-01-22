import { dateArr } from "@@/tests/utils/helpers";
import { expect, test } from "vitest";

const testCases = [
    { title: "an empty array when length is zero", length: 0, options: {}, expected: [] },
    {
        title: "a single element equal to the default ref date when no options are provided and length is one",
        length: 1,
        options: undefined,
        expected: ["2025-06-01T12:00:00Z"],
    },
    {
        title: "dates one day apart (descending) by default",
        length: 2,
        options: undefined,
        expected: ["2025-06-01T12:00:00Z", "2025-05-31T12:00:00Z"],
    },
    {
        title: "dates one day apart (asc) when future option is passed",
        length: 2,
        options: { when: "future" },
        expected: ["2025-06-01T12:00:00Z", "2025-06-02T12:00:00Z"],
    },
    {
        title: "allows passing other date parameters",
        length: 3,
        options: { when: "future", days: 2, hours: 2, minutes: 2, seconds: 2, refDate: "2020-01-01T00:00:00Z" },
        expected: ["2020-01-01T00:00:00Z", "2020-01-03T02:02:02Z", "2020-01-05T04:04:04Z"],
    },
] as const;

test.each(testCases)("should return $title", ({ expected, length, options }) => {
    expect(dateArr(length, { ...options })).toEqual(expected.map(d => new Date(d)));
});
