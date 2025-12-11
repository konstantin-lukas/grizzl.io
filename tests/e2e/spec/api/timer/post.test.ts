import { expect, test } from "@e2e/fixtures";
import { BASE_INTERVAL, BASE_TIMER } from "@e2e/fixtures/constants/timer";
import { TIMER_BAD_REQUEST_TEST_CASES } from "@e2e/utils/helpers/timer";

test.beforeEach(async ({ db }) => {
    await db.timer.reset();
});

for (const [name, data] of TIMER_BAD_REQUEST_TEST_CASES) {
    test(`should reject creating a timer when ${name}`, async ({ request }) => {
        const response = await request.post("/api/timers", { data });
        expect(response.status()).toBe(400);
    });
}

test("should allow creating a new timer with valid values", async ({ request, db }) => {
    const response = await request.post("/api/timers", { data: BASE_TIMER });
    const apiTimer = response.headers().location;
    expect(response.status()).toBe(201);
    const timers = await db.timer.select();
    expect(timers).toHaveLength(1);
    expect(apiTimer).toBe(`/api/timers/${timers[0].id}`);
});

test("should ignore any provided id for determining ownership", async ({ request, db }) => {
    await request.post("/api/timers", { data: { ...BASE_TIMER, userId: "2222222222222222" } });
    const timers = await db.timer.select();
    const user = await db.user.select("user@test.com");
    expect(timers[0].userId).toBe(user.id);
});

test("should transform an empty interval title to null", async ({ request, db }) => {
    await request.post("/api/timers", { data: { ...BASE_TIMER, intervals: [{ ...BASE_INTERVAL, title: "" }] } });
    const intervals = await db.timerInterval.select();
    expect(intervals[0].title).toBeNull();
});
