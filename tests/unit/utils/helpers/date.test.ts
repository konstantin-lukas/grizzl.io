import { date } from "@@/tests/utils/helpers";
import { expect, test } from "vitest";

const testCases = [
    { title: "one year in the past", days: 365, expected: "2024-06-01T12:00:00Z" },
    { title: "one day in the past", days: 1, expected: "2025-05-31T12:00:00Z" },
    { title: "one hour in the past", hours: 1, expected: "2025-06-01T11:00:00Z" },
    { title: "one minute in the past", minutes: 1, expected: "2025-06-01T11:59:00Z" },
    { title: "one second in the past", seconds: 1, expected: "2025-06-01T11:59:59Z" },

    { title: "one year in the future", days: 365, when: "future", expected: "2026-06-01T12:00:00Z" },
    { title: "one day in the future", days: 1, when: "future", expected: "2025-06-02T12:00:00Z" },
    { title: "one hour in the future", hours: 1, when: "future", expected: "2025-06-01T13:00:00Z" },
    { title: "one minute in the future", minutes: 1, when: "future", expected: "2025-06-01T12:01:00Z" },
    { title: "one second in the future", seconds: 1, when: "future", expected: "2025-06-01T12:00:01Z" },

    {
        title: "one year in the past given a custom reference date",
        days: 365,
        refDate: "2023-07-12T10:30:12Z",
        expected: "2022-07-12T10:30:12Z",
    },
    {
        title: "one day in the past given a custom reference date",
        days: 1,
        refDate: "2023-07-12T10:30:12Z",
        expected: "2023-07-11T10:30:12Z",
    },
    {
        title: "one hour in the past given a custom reference date",
        hours: 1,
        refDate: "2023-07-12T10:30:12Z",
        expected: "2023-07-12T09:30:12Z",
    },
    {
        title: "one minute in the past given a custom reference date",
        minutes: 1,
        refDate: "2023-07-12T10:30:12Z",
        expected: "2023-07-12T10:29:12Z",
    },
    {
        title: "one second in the past given a custom reference date",
        seconds: 1,
        refDate: "2023-07-12T10:30:12Z",
        expected: "2023-07-12T10:30:11Z",
    },

    {
        title: "one year in the future given a custom reference date (leap year)",
        days: 366,
        when: "future",
        refDate: "2023-07-12T10:30:12Z",
        expected: "2024-07-12T10:30:12Z",
    },
    {
        title: "one day in the future given a custom reference date",
        days: 1,
        when: "future",
        refDate: "2023-07-12T10:30:12Z",
        expected: "2023-07-13T10:30:12Z",
    },
    {
        title: "one hour in the future given a custom reference date",
        hours: 1,
        when: "future",
        refDate: "2023-07-12T10:30:12Z",
        expected: "2023-07-12T11:30:12Z",
    },
    {
        title: "one minute in the future given a custom reference date",
        minutes: 1,
        when: "future",
        refDate: "2023-07-12T10:30:12Z",
        expected: "2023-07-12T10:31:12Z",
    },
    {
        title: "one second in the future given a custom reference date",
        seconds: 1,
        when: "future",
        refDate: "2023-07-12T10:30:12Z",
        expected: "2023-07-12T10:30:13Z",
    },
    {
        title: "one day, hour, minute, and second in the future",
        days: 1,
        hours: 1,
        minutes: 1,
        seconds: 1,
        when: "future",
        expected: "2025-06-02T13:01:01Z",
    },
] as const;

test.each(testCases)("should return $expected when $title", ({ expected, ...options }) => {
    expect(date(options)).toEqual(new Date(expected));
});
