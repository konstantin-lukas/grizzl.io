import { BASE_INTERVAL, BASE_TIMER, FULL_INTERVAL, FULL_TIMER } from "~~/test-utils/constants/timer";
import { expect, test } from "~~/test-utils/playwright";
import { test401WhenLoggedOut, testIdParameter } from "~~/test-utils/playwright/utils/helpers";
import { TIMER_BAD_REQUEST_TEST_CASES } from "~~/test-utils/playwright/utils/helpers/timer";

testIdParameter("put", "/api/timers", BASE_TIMER);

for (const [name, data] of TIMER_BAD_REQUEST_TEST_CASES) {
    test(`rejects putting a timer when ${name}`, async ({ request, db }) => {
        await db.timer.insert(1);
        const [timer] = await db.timer.select();
        const response = await request.put(`/api/timers/${timer!.id}`, { data });
        expect(response.status()).toBe(400);
    });
}

test("allows creating a new interval by not providing an id", async ({ request, db }) => {
    const [timer] = await db.timer.insert(1);
    await request.put(`/api/timers/${timer.id}`, { data: BASE_TIMER });
    const intervals = await db.timerInterval.select();
    delete (intervals[0] as { id?: string }).id;
    expect(intervals).toStrictEqual([{ ...BASE_INTERVAL, timerId: timer.id, index: 0 }]);
});

test("allows editing intervals by their id", async ({ request, db }) => {
    const [timer] = await db.timer.insert(1);
    const [timerInterval] = await db.timerInterval.insert(2, { timerId: timer.id });
    await request.put(`/api/timers/${timer.id}`, {
        data: { ...BASE_TIMER, intervals: [{ ...BASE_INTERVAL, id: timerInterval.id }] },
    });
    const intervals = await db.timerInterval.select();
    expect(intervals).toStrictEqual([{ ...BASE_INTERVAL, id: timerInterval.id, timerId: timer.id, index: 0 }]);
});

test("does not allow editing other user's intervals", async ({ request, db }) => {
    const otherUser = await db.user.selectByEmail("cmontgomeryburns@springfieldnuclear.com");
    const [myTimer] = await db.timer.insert(1);
    const [otherUsersTimer] = await db.timer.insert(1, { userId: otherUser!.id });
    const [myInterval] = await db.timerInterval.insert(1, { timerId: myTimer.id });
    const [otherUsersInterval] = await db.timerInterval.insert(1, { timerId: otherUsersTimer.id });
    await request.put(`/api/timers/${myTimer.id}`, {
        data: { ...BASE_TIMER, intervals: [{ ...BASE_INTERVAL, id: otherUsersInterval.id }] },
    });
    const intervals = await db.timerInterval.select();
    expect(intervals.find(interval => interval.id === otherUsersInterval.id)).toStrictEqual(otherUsersInterval);
    expect(intervals.find(interval => interval.id === myInterval.id)).not.toStrictEqual(myInterval);
});

test("returns a 204 even when the data hasn't changed", async ({ request, db }) => {
    const [t] = await db.timer.insert(1);
    await db.timerInterval.insert(2, { timerId: t.id });
    const getResponseBefore = await request.get("/api/timers");
    const [timerBefore] = await getResponseBefore.json();
    const putResponse = await request.put(`/api/timers/${timerBefore.id}`, { data: timerBefore });
    expect(putResponse.status()).toBe(204);
    const getResponseAfter = await request.get("/api/timers");
    const [timerAfter] = await getResponseAfter.json();
    expect(timerBefore).toStrictEqual(timerAfter);
});

test("only allows putting certain properties", async ({ request, db }) => {
    const [timer] = await db.timer.insert(1);
    const [timerInterval] = await db.timerInterval.insert(2, { timerId: timer.id });
    expect(await db.timerInterval.select()).toHaveLength(2);
    const response = await request.put(`/api/timers/${timer.id}`, {
        data: {
            ...FULL_TIMER,
            intervals: [{ ...FULL_INTERVAL, id: timerInterval.id }],
            deleted: true,
        },
    });
    expect(response.status()).toBe(204);
    const intervals = await db.timerInterval.select();
    expect(intervals).toHaveLength(1);
    const [putTimer] = await db.timer.select(timer.id);
    const [putTimerInterval] = intervals;
    expect(putTimer).toStrictEqual({ ...timer, title: FULL_TIMER.title, ttsVoices: FULL_TIMER.ttsVoices });
    expect(putTimerInterval).toStrictEqual({
        ...timerInterval,
        beatPattern: FULL_INTERVAL.beatPattern,
        title: FULL_INTERVAL.title,
        duration: FULL_INTERVAL.duration,
        preparationTime: FULL_INTERVAL.preparationTime,
        repeatCount: FULL_INTERVAL.repeatCount,
    });
});

test("does not allow deleting all intervals by providing an empty array", async ({ request, db }) => {
    const [timer] = await db.timer.insert(1);
    await db.timerInterval.insert(2, { timerId: timer.id });
    const preIntervals = await db.timerInterval.select();
    expect(preIntervals).toHaveLength(2);
    const response = await request.put(`/api/timers/${timer.id}`, {
        data: {
            ...FULL_TIMER,
            intervals: [],
        },
    });
    expect(response.status()).toBe(400);
    const postIntervals = await db.timerInterval.select();
    expect(preIntervals).toStrictEqual(postIntervals);
});

test("does not allow deleting all intervals by providing an unknown id", async ({ request, db }) => {
    const [timer] = await db.timer.insert(1);
    const preIntervals = await db.timerInterval.insert(2, { timerId: timer.id });
    expect(preIntervals).toHaveLength(2);
    const response = await request.put(`/api/timers/${timer.id}`, {
        data: {
            ...timer,
            intervals: [{ ...BASE_INTERVAL, id: "YePJw2u2csA5Srap", timerId: timer.id }],
        },
    });
    expect(response.status()).toBe(204);
    const postIntervals = await db.timerInterval.select();
    expect(postIntervals).toStrictEqual([{ ...BASE_INTERVAL, id: postIntervals[0]!.id, index: 0, timerId: timer.id }]);
});

test401WhenLoggedOut("put", "/api/timers");
