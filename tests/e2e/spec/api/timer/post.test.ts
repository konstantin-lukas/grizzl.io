import { arr, createInvalidTypeTestCases, str } from "@@/tests/utils/helpers";
import { omit } from "@@/tests/utils/object";
import { expect, test } from "@e2e/fixtures";

/* ------------------------------------------------------------------------------------------------------------------ */
/*    Base Fixtures                                                                                                   */
/* ------------------------------------------------------------------------------------------------------------------ */

const BASE_INTERVAL = {
    title: null,
    repeatCount: 1,
    duration: 10000,
    beatPattern: null,
};

const BASE_TIMER = {
    title: "Upper Body Workout",
    ttsVoice: null,
    intervals: [BASE_INTERVAL],
};

/* ------------------------------------------------------------------------------------------------------------------ */
/*    Helpers                                                                                                         */
/* ------------------------------------------------------------------------------------------------------------------ */

function withInterval(property: keyof typeof BASE_INTERVAL, value: unknown) {
    return { ...BASE_TIMER, intervals: [{ ...BASE_INTERVAL, [property]: value }] };
}

function withTimer(property: keyof typeof BASE_TIMER, value: unknown) {
    return { ...BASE_TIMER, [property]: value };
}

function createInvalidTypeIntervalTestCases(
    property: keyof (typeof BASE_TIMER)["intervals"][number],
    valid: Parameters<typeof createInvalidTypeTestCases>[2]["valid"],
) {
    return createInvalidTypeTestCases(BASE_INTERVAL, property, {
        valid,
        caseName: (property, type) => `property ${property} on an interval is a ${type}`,
        dataTransform: (interval, property, value) => ({
            ...BASE_TIMER,
            intervals: [{ ...interval, [property]: value }],
        }),
    });
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*    Test Tables                                                                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

const topLevelCases = [
    ["the title is empty", withTimer("title", "")],
    ["the title is too long", withTimer("title", str(101))],
    ["the ttsVoice is empty", withTimer("ttsVoice", "")],
    ["the ttsVoice is too long", withTimer("ttsVoice", str(201))],
    ["the title is missing", omit(BASE_TIMER, "title")],
    ["the ttsVoice is missing", omit(BASE_TIMER, "ttsVoice")],
    ["the intervals is missing", omit(BASE_TIMER, "intervals")],
    ["there are no intervals", withTimer("intervals", [])],
    ["there are too many intervals", withTimer("intervals", arr(101, BASE_INTERVAL))],
];

const intervalLevelCases = [
    ["an interval has no duration", { ...BASE_TIMER, intervals: omit(BASE_INTERVAL, "duration") }],
    ["an interval has no repeatCount", { ...BASE_TIMER, intervals: omit(BASE_INTERVAL, "repeatCount") }],
    ["an interval title is too long", withInterval("title", str(101))],
    ["an interval repeatCount is too small", withInterval("repeatCount", 0)],
    ["an interval repeatCount is too large", withInterval("repeatCount", 101)],
    ["an interval duration is too small", withInterval("duration", 0)],
    ["an interval duration is too large", withInterval("duration", 3600001)],
    ["an interval has an empty beatPattern", withInterval("beatPattern", [])],
    ["an interval has a beatPattern that's too short", withInterval("beatPattern", ["low"])],
    ["an interval has a beatPattern that's too long", withInterval("beatPattern", arr(17, "low"))],
    ["an interval has a beatPattern that contains invalid values", withInterval("beatPattern", ["bananas"])],
];

const invalidTypeCases = [
    ...createInvalidTypeTestCases(BASE_TIMER, "title", { valid: ["string"] }),
    ...createInvalidTypeTestCases(BASE_TIMER, "ttsVoice", { valid: ["string", "null"] }),
    ...createInvalidTypeTestCases(BASE_TIMER, "intervals", { valid: ["null"] }),
    ...createInvalidTypeIntervalTestCases("title", ["string", "null"]),
    ...createInvalidTypeIntervalTestCases("beatPattern", ["null"]),
    ...createInvalidTypeIntervalTestCases("duration", ["int"]),
    ...createInvalidTypeIntervalTestCases("repeatCount", ["int"]),
];

const badRequestTestCases = [...topLevelCases, ...intervalLevelCases, ...invalidTypeCases];

/* ------------------------------------------------------------------------------------------------------------------ */
/*    Tests                                                                                                           */
/* ------------------------------------------------------------------------------------------------------------------ */

test.beforeEach(async ({ db }) => {
    await db.timer.reset();
});

for (const [name, data] of badRequestTestCases) {
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
