import { expect, test } from "vitest";
import { parseCalendarDate } from "~/core/utils/date";

test("parses a valid YYYY-MM-DD date and returns it as a calendar date", () => {
    const result = parseCalendarDate("2025-06-01");
    expect(result.toString()).toBe("2025-06-01");
});

test("throws an error if the date is not parsable", () => {
    expect(() => parseCalendarDate("AAAA-06-01")).toThrow();
});
