import { expect, test } from "@e2e/fixtures";

test("should allow retrieving a list of timers", async ({ request, db }) => {
    await db.timer.reset();
    const timers = await db.timer.insert();
    const timerIntervals = await Promise.all(timers.map(timer => db.timerInterval.insert(timer.id)));

    console.log(timers, timerIntervals);
    const response = await request.get("/api/timers");
    expect(response.status()).toBe(200);
});
