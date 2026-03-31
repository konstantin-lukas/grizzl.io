import { BASE_INTERVAL, BASE_TIMER, FULL_TIMER } from "~~/test-utils/constants/timer";
import { expect, test } from "~~/test-utils/playwright";
import { makeTimerTestBuilder } from "~~/test-utils/playwright/builders/timer";

const route = "/api/timers";

const testBuilder = makeTimerTestBuilder("put");

testBuilder
    .returnsA401StatusCodeWhenAnUnauthenticatedRequestIsMade()
    .returnsA404StatusCodeWhenTheProvidedIdIsUnknown()
    .returnsA400StatusCodeWhenTheProvidedIdHasTheWrongFormat()
    .rejectsRequestsWhenPayloadIsInvalid()
    .acceptsRequestsWhenPayloadIsValid()
    .build();

test("allows creating a new interval by not providing an id", async ({ request, db }) => {
    const [data] = await db.timer.insert(1);
    await request.put(`${route}/${data.id}`, { data: BASE_TIMER });
    const intervals = await db.timerInterval.select();
    delete (intervals[0] as { id?: string }).id;
    expect(intervals).toStrictEqual([{ ...BASE_INTERVAL, timerId: data.id, index: 0 }]);
});

test("allows editing intervals by their id", async ({ request, db }) => {
    const [timer] = await db.timer.insert(1);
    const [timerInterval] = await db.timerInterval.insert(2, { timerId: timer.id });
    await request.put(`${route}/${timer.id}`, {
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
    await request.put(`${route}/${myTimer.id}`, {
        data: { ...BASE_TIMER, intervals: [{ ...BASE_INTERVAL, id: otherUsersInterval.id }] },
    });
    const intervals = await db.timerInterval.select();
    expect(intervals.find(interval => interval.id === otherUsersInterval.id)).toStrictEqual(otherUsersInterval);
    expect(intervals.find(interval => interval.id === myInterval.id)).not.toStrictEqual(myInterval);
});

test("does not allow deleting all intervals by providing an empty array", async ({ request, db }) => {
    const [timer] = await db.timer.insert(1);
    await db.timerInterval.insert(2, { timerId: timer.id });
    const preIntervals = await db.timerInterval.select();
    expect(preIntervals).toHaveLength(2);
    const response = await request.put(`${route}/${timer.id}`, {
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
    const response = await request.put(`${route}/${timer.id}`, {
        data: {
            ...timer,
            intervals: [{ ...BASE_INTERVAL, id: "YePJw2u2csA5Srap", timerId: timer.id }],
        },
    });
    expect(response.status()).toBe(204);
    const postIntervals = await db.timerInterval.select();
    expect(postIntervals).toStrictEqual([{ ...BASE_INTERVAL, id: postIntervals[0]!.id, index: 0, timerId: timer.id }]);
});
