import { BASE_INTERVAL, BASE_TIMER } from "~~/test-utils/constants/timer";
import { expect, test } from "~~/test-utils/playwright";

const route = "/api/timers";

test("transforms an empty interval title to null", async ({ request, db }) => {
    await request.post(route, { data: { ...BASE_TIMER, intervals: [{ ...BASE_INTERVAL, title: "" }] } });
    const intervals = await db.timerInterval.select();
    expect(intervals[0]!.title).toBeNull();
});
