import { CalendarDate, DateFormatter, getLocalTimeZone } from "@internationalized/date";
import { expect, test } from "vitest";
import { formatDate } from "~/core/utils/date";

test("formats a CalendarDate using the local time zone conversion", () => {
    const locale = "en-US";
    const tz = getLocalTimeZone();
    const input = new CalendarDate(2025, 6, 1);

    const expected = new DateFormatter(locale).format(input.toDate(tz));
    const result = formatDate(input, locale);

    expect(result).toBe(expected);
});

test("formats Date and ISO string inputs consistently for the same instant", () => {
    const locale = "en-US";
    const iso = "2025-06-01T12:00:00.000Z";

    const fromDate = formatDate(new Date(iso), locale);
    const fromString = formatDate(iso, locale);

    expect(fromDate).toBe(fromString);
});

test("uses the provided locale for formatting", () => {
    const input = new Date("2025-06-01T12:00:00.000Z");

    const en = formatDate(input, "en-US");
    const de = formatDate(input, "de-DE");

    expect(en).toBe(new DateFormatter("en-US").format(input));
    expect(de).toBe(new DateFormatter("de-DE").format(input));
    expect(en).not.toBe(de);
});
