import { BASE_TIMER, FULL_TIMER } from "~~/test-utils/constants/timer";
import { type Method, TestBuilder } from "~~/test-utils/playwright/builders/base";
import {
    TIMER_BAD_REQUEST_TEST_CASES,
    TIMER_VALID_REQUEST_TEST_CASES,
} from "~~/test-utils/playwright/test-tables/timer";

export function makeTimerTestBuilder(method: Method) {
    return new TestBuilder({
        fixtureProvider: async ({ db, userId }) => {
            const [timer] = await db.timer.insert(1, userId ? { userId } : undefined);
            const intervals = await db.timerInterval.insert(2, { timerId: timer.id });
            return {
                id: timer.id,
                data: timer,
                basePath: "/api/timers",
                fullPath: `/api/timers/${timer.id}`,
                getDatabaseOverrides: { intervals: intervals.map(({ index, timerId, ...rest }) => rest) },
            };
        },
        baseData: BASE_TIMER,
        fullData: FULL_TIMER,
        badPost: TIMER_BAD_REQUEST_TEST_CASES,
        badPut: TIMER_BAD_REQUEST_TEST_CASES,
        validPost: TIMER_VALID_REQUEST_TEST_CASES,
        validPut: TIMER_VALID_REQUEST_TEST_CASES,
        fixtureName: "timer",
        dataObjects: [
            {
                fixtureName: "timerInterval",
                foreignKeyName: "timerId",
                objectName: "intervals",
                omittedFields: ["id", "index", "timerId"],
            },
        ],
        method,
    });
}
