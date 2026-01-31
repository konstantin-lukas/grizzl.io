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
        title: "dates parameters given other parameters",
        length: 3,
        options: { when: "future", days: 2, hours: 2, minutes: 2, seconds: 2, refDate: "2020-01-01T00:00:00Z" },
        expected: ["2020-01-01T00:00:00Z", "2020-01-03T02:02:02Z", "2020-01-05T04:04:04Z"],
    },
    {
        title: "dates without randomized distances",
        length: 3,
        options: { when: "future", days: 50, refDate: "2020-01-01T00:00:00Z" },
        expected: ["2020-01-01T00:00:00Z", "2020-02-20T00:00:00Z", "2020-04-10T00:00:00Z"],
    },
    {
        title: "dates with randomized distances",
        length: 3,
        options: { when: "future", days: 50, refDate: "2020-01-01T00:00:00Z", exact: false },
        expected: ["2020-01-01T00:00:00Z", "2020-01-18T00:00:00Z", "2020-03-07T00:00:00Z"],
    },
    {
        title: "unique dates when unique parameter is passed but not exact",
        length: 3,
        options: { when: "future", refDate: "2020-01-01T00:00:00Z", exact: false, unique: true },
        expected: ["2020-01-01T00:00:00Z", "2020-01-02T00:00:00Z", "2020-01-03T00:00:00Z"],
    },
    {
        title: "potentially duplicate dates when unique and exact parameters are false",
        length: 3,
        options: { when: "future", refDate: "2020-01-01T00:00:00Z", exact: false, unique: false },
        expected: ["2020-01-01T00:00:00Z", "2020-01-02T00:00:00Z", "2020-01-02T00:00:00Z"],
    },
] as const;

test.each(testCases)("should return $title", ({ expected, length, options }) => {
    expect(dateArr({ length, ...options })).toEqual(expected.map(d => new Date(d)));
});
