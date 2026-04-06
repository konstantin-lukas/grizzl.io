import { CalendarDate } from "@internationalized/date";
import { expect, test } from "vitest";
import { eachDayOfInterval } from "~/core/utils/date";

test("returns an empty array when start is after end", () => {
    const start = new CalendarDate(2025, 6, 3);
    const end = new CalendarDate(2025, 6, 1);

    const result = eachDayOfInterval(start, end);

    expect(result).toEqual([]);
});

test("returns a single date when start and end are the same", () => {
    const start = new CalendarDate(2025, 6, 1);

    const result = eachDayOfInterval(start, start);

    expect(result.map(date => date.toString())).toEqual(["2025-06-01"]);
});

test("returns all dates in the interval, inclusive and ordered", () => {
    const start = new CalendarDate(2025, 6, 1);
    const end = new CalendarDate(2025, 6, 3);

    const result = eachDayOfInterval(start, end);

    expect(result.map(date => date.toString())).toEqual(["2025-06-01", "2025-06-02", "2025-06-03"]);
});
