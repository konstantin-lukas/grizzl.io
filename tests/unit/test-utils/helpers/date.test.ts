import { date } from "@@/test-utils/helpers/data";
import { expect, test } from "vitest";

const testCases = [
    {
        title: "all options are left to their default",
        days: undefined,
        expected: "2025-01-23T02:17:18.000Z",
    },
    {
        title: "max time span is one day before ref date",
        days: 1,
        hours: 0,
        minutes: 0,
        seconds: 0,
        expected: "2025-05-31T12:00:00.000Z",
    },
    {
        title: "max time span is one hour before ref date",
        days: 0,
        hours: 1,
        minutes: 0,
        seconds: 0,
        expected: "2025-06-01T11:00:00.000Z",
    },
    {
        title: "max time span is one minute before ref date",
        days: 0,
        hours: 0,
        minutes: 1,
        seconds: 0,
        expected: "2025-06-01T11:59:00.000Z",
    },
    {
        title: "max time span is one second before ref date",
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 1,
        expected: "2025-06-01T11:59:59.000Z",
    },
    {
        title: "max time span is one second before ref date",
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 1,
        when: "afterRef",
        expected: "2025-06-01T12:00:01.000Z",
    },
    {
        title: "max time span is one second before ref date",
        days: 0,
        hours: 0,
        minutes: 1,
        seconds: 0,
        when: "afterRef",
        expected: "2025-06-01T12:01:00.000Z",
    },
    {
        title: "max time span is one second before ref date",
        days: 0,
        hours: 1,
        minutes: 0,
        seconds: 0,
        when: "afterRef",
        expected: "2025-06-01T13:00:00.000Z",
    },
    {
        title: "max time span is one second before ref date",
        days: 1,
        hours: 0,
        minutes: 0,
        seconds: 0,
        when: "afterRef",
        expected: "2025-06-02T12:00:00.000Z",
    },
] as const;

test.each(testCases)("returns $expected when $title", ({ expected, ...options }) => {
    expect(date(options)).toEqual(new Date(expected));
});
