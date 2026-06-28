import { CalendarDateTime, DateFormatter, getLocalTimeZone } from "@internationalized/date";
import { expect, test } from "vitest";
import { formatDateTime } from "~/core/utils/date";

test("formats a CalendarDate using the local time zone conversion", () => {
    const locale = "en-US";
    const tz = getLocalTimeZone();
    const input = new CalendarDateTime(2025, 6, 1);

    const expected = new DateFormatter(locale, { dateStyle: "medium", timeStyle: "medium" }).format(input.toDate(tz));
    const result = formatDateTime(input, locale);

    expect(result).toBe(expected);
});

test("formats Date and ISO string inputs consistently for the same instant", () => {
    const locale = "en-US";
    const iso = "2025-06-01T12:00:00.000Z";

    const fromDate = formatDateTime(new Date(iso), locale);
    const fromString = formatDateTime(iso, locale);

    expect(fromDate).toBe(fromString);
});

test("uses the provided locale for formatting", () => {
    const input = new Date("2025-06-01T12:00:00.000Z");

    const en = formatDateTime(input, "en-US");
    const de = formatDateTime(input, "de-DE");

    expect(en).toBe(new DateFormatter("en-US", { dateStyle: "medium", timeStyle: "medium" }).format(input));
    expect(de).toBe(new DateFormatter("de-DE", { dateStyle: "medium", timeStyle: "medium" }).format(input));
    expect(en).not.toBe(de);
});
