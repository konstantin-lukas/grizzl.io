import { BASE_INTERVAL, BASE_TIMER } from "~~/test-utils/constants/timer";
import { expect, test } from "~~/test-utils/playwright";
import { makeTimerTestBuilder } from "~~/test-utils/playwright/utils/helpers/timer";

const route = "/api/timers";

const testBuilder = makeTimerTestBuilder("post");

testBuilder
    .returnsA401StatusCodeWhenAnUnauthenticatedRequestIsMade()
    .ignoresAnyProvidedIdForDeterminingOwnership()
    .rejectsRequestsWhenPayloadIsInvalid()
    .acceptsRequestsWhenPayloadIsValid()
    .build();

test("transforms an empty interval title to null", async ({ request, db }) => {
    await request.post(route, { data: { ...BASE_TIMER, intervals: [{ ...BASE_INTERVAL, title: "" }] } });
    const intervals = await db.timerInterval.select();
    expect(intervals[0]!.title).toBeNull();
});
