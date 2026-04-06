import type { Language } from "#shared/core/constants/i18n.constant";
import { CalendarDate, DateFormatter, getLocalTimeZone } from "@internationalized/date";

export function eachDayOfInterval(start: CalendarDate, end: CalendarDate) {
    if (start.compare(end) > 0) return [];
    const result = [];
    let currentDate = start;
    while (currentDate.compare(end) <= 0) {
        result.push(currentDate);
        currentDate = currentDate.add({ days: 1 });
    }
    return result;
}

export function formatDate(date: CalendarDate | Date | string, locale: Language) {
    const tz = getLocalTimeZone();
    const resolvedDate = date instanceof CalendarDate ? date.toDate(tz) : new Date(date);
    const formatter = new DateFormatter(locale);
    return formatter.format(resolvedDate);
}
