import { omit } from "@@/tests/utils/object";
import { expect, test } from "@e2e/fixtures";
import { createInvalidTypeTestCases, types } from "@e2e/utils/helpers";
import { faker } from "@faker-js/faker";

const data = {
    title: "Upper Body Workout",
    ttsVoice: null,
    intervals: [
        {
            title: null,
            repeatCount: 1,
            duration: 10000,
            beatPattern: null,
        },
    ],
};

function createInvalidTypeIntervalTestCases(
    property: keyof (typeof data)["intervals"][number],
    valid: (typeof types)[number][0][],
) {
    const testCases = [];
    for (const [type, value] of types) {
        if (!valid.includes(type)) {
            testCases.push([
                `property ${property} on an interval is a ${type}`,
                { ...data, intervals: [{ ...data.intervals[0], [property]: value }] },
            ]);
        }
    }
    return testCases;
}

const badRequestTestCases = [
    ["the title is empty", { ...data, title: "" }],
    ["the title is too long", { ...data, title: faker.string.alphanumeric({ length: 101 }) }],
    ["the ttsVoice is empty", { ...data, ttsVoice: "" }],
    ["the ttsVoice is too long", { ...data, ttsVoice: faker.string.alphanumeric({ length: 201 }) }],
    ["the title is missing", omit(data, "title")],
    ["the ttsVoice is missing", omit(data, "ttsVoice")],
    ["the intervals is missing", omit(data, "intervals")],
    ["there are no intervals", { ...data, intervals: [] }],
    ["there are too many intervals", { ...data, intervals: Array.from({ length: 101 }).fill(data.intervals[0]) }],
    ["an interval has no duration", { ...data, intervals: omit(data.intervals[0], "duration") }],
    ["an interval has no repeatCount", { ...data, intervals: omit(data.intervals[0], "repeatCount") }],
    [
        "an interval title is too long",
        { ...data, intervals: [{ ...data.intervals[0], title: faker.string.alphanumeric({ length: 101 }) }] },
    ],
    ["an interval repeatCount is too small", { ...data, intervals: [{ ...data.intervals[0], repeatCount: 0 }] }],
    ["an interval repeatCount is too large", { ...data, intervals: [{ ...data.intervals[0], repeatCount: 101 }] }],
    ["an interval duration is too small", { ...data, intervals: [{ ...data.intervals[0], duration: 0 }] }],
    ["an interval duration is too large", { ...data, intervals: [{ ...data.intervals[0], duration: 3600001 }] }],
    ["an interval has an empty beatPattern", { ...data, intervals: [{ ...data.intervals[0], beatPattern: [] }] }],
    [
        "an interval has a beatPattern that's too short",
        { ...data, intervals: [{ ...data.intervals[0], beatPattern: ["low"] }] },
    ],
    [
        "an interval has a beatPattern that's too long",
        { ...data, intervals: [{ ...data.intervals[0], beatPattern: Array.from({ length: 17 }).fill("low") }] },
    ],
    [
        "an interval has a beatPattern that contains invalid values",
        { ...data, intervals: [{ ...data.intervals[0], beatPattern: ["bananas"] }] },
    ],
    ...createInvalidTypeTestCases(data, "title", { valid: ["string"] }),
    ...createInvalidTypeTestCases(data, "ttsVoice", { valid: ["string", "null"] }),
    ...createInvalidTypeTestCases(data, "intervals", { valid: ["null"] }),
    ...createInvalidTypeIntervalTestCases("title", ["string", "null"]),
    ...createInvalidTypeIntervalTestCases("beatPattern", ["null"]),
    ...createInvalidTypeIntervalTestCases("duration", ["int"]),
    ...createInvalidTypeIntervalTestCases("repeatCount", ["int"]),
];

for (const [name, data] of badRequestTestCases) {
    test(`should reject creating a timer when ${name}`, async ({ request }) => {
        const response = await request.post("/api/timers", { data });
        expect(response.status()).toBe(400);
    });
}

test.beforeEach(async ({ db }) => {
    await db.timer.reset();
});

test("should allow creating a new timer with valid values", async ({ request, db }) => {
    const response = await request.post("/api/timers", { data });
    const apiTimer = response.headers().location;
    expect(response.status()).toBe(201);
    const timers = await db.timer.select();
    expect(timers).toHaveLength(1);
    expect(apiTimer).toBe(`/api/timers/${timers[0].id}`);
});

test("should ignore any provided id for determining ownership", async ({ request, db }) => {
    await request.post("/api/timers", { data: { ...data, userId: "2222222222222222" } });
    const timers = await db.timer.select();
    const user = await db.user.select("user@test.com");
    expect(timers[0].userId).toBe(user.id);
});

test("should transform an empty interval title to null", async ({ request, db }) => {
    await request.post("/api/timers", { data: { ...data, intervals: [{ ...data.intervals[0], title: "" }] } });
    const intervals = await db.timerInterval.select();
    expect(intervals[0].title).toBeNull();
});
