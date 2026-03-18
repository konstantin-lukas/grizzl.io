import { BASE_INTERVAL, BASE_TIMER } from "~~/test-utils/constants/timer";
import { expect, test } from "~~/test-utils/playwright";
import { test401WhenLoggedOut } from "~~/test-utils/playwright/utils/helpers";
import {
    TIMER_BAD_REQUEST_TEST_CASES,
    TIMER_VALID_REQUEST_TEST_CASES,
} from "~~/test-utils/playwright/utils/helpers/timer";

const route = "/api/timers";

test401WhenLoggedOut("post", route);

for (const [name, data] of TIMER_BAD_REQUEST_TEST_CASES) {
    test(`rejects creating resources when ${name}`, async ({ request }) => {
        const response = await request.post(route, { data });
        expect(response.status()).toBe(400);
    });
}

for (const [name, data] of TIMER_VALID_REQUEST_TEST_CASES) {
    test(`allows creating resources when ${name}`, async ({ request, db }) => {
        const response = await request.post(route, { data });
        const responseData = response.headers().location;
        expect(response.status()).toBe(201);
        const { id, createdAt, deletedAt, userId, ...rest } = (await db.timer.select())[0]!;
        const intervals = (await db.timerInterval.select()).map(({ id, timerId, index, ...interval }) => interval);
        expect({ ...rest, intervals }).toStrictEqual(data);
        expect(responseData).toBe(`${route}/${id}`);
    });
}

test("ignores any provided id for determining ownership", async ({ request, db }) => {
    await request.post(route, { data: { ...BASE_TIMER, userId: "2222222222222222" } });
    const data = await db.timer.select();
    const user = await db.user.selectByEmail("user@test.com");
    expect(data[0]!.userId).toBe(user!.id);
});

test("transforms an empty interval title to null", async ({ request, db }) => {
    await request.post(route, { data: { ...BASE_TIMER, intervals: [{ ...BASE_INTERVAL, title: "" }] } });
    const intervals = await db.timerInterval.select();
    expect(intervals[0]!.title).toBeNull();
});
