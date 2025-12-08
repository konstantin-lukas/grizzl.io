import { omit } from "@@/tests/utils/object";
import { expect, test } from "@e2e/fixtures";
import { faker } from "@faker-js/faker";

test.beforeEach(async ({ db }) => {
    await db.timer.reset();
});

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

test("should allow creating a new timer with valid values", async ({ request, db }) => {
    const response = await request.post("/api/timers", { data });
    const apiTimer = response.headers().location;
    expect(response.status()).toBe(201);
    const timers = await db.timer.select();
    expect(timers).toHaveLength(1);
    expect(apiTimer).toBe(`/api/timers/${timers[0].id}`);
});

function createInvalidTypeTestCases(
    property: keyof typeof data,
    valid: ("string" | "int" | "float" | "boolean" | "null" | "object" | "array")[],
) {
    const testCases = [];
    if (!valid.includes("string")) testCases.push([`property ${property} is a string`, { ...data, [property]: "42" }]);
    if (!valid.includes("int")) testCases.push([`property ${property} is an int`, { ...data, [property]: 42 }]);
    if (!valid.includes("float")) testCases.push([`property ${property} is a float`, { ...data, [property]: 42.5 }]);
    if (!valid.includes("object")) testCases.push([`property ${property} is an object`, { ...data, [property]: {} }]);
    if (!valid.includes("array")) testCases.push([`property ${property} is an array`, { ...data, [property]: [] }]);
    if (!valid.includes("boolean"))
        testCases.push([`property ${property} is a boolean`, { ...data, [property]: true }]);
    if (!valid.includes("null")) testCases.push([`property ${property} is null`, { ...data, [property]: null }]);
    return testCases;
}

function createInvalidTypeIntervalTestCases(
    property: keyof (typeof data)["intervals"][number],
    valid: ("string" | "int" | "float" | "boolean" | "null" | "object" | "array")[],
) {
    const testCases = [];
    if (!valid.includes("string"))
        testCases.push([
            `property ${property} on an interval is a string`,
            { ...data, intervals: [{ ...data.intervals[0], [property]: "42" }] },
        ]);
    if (!valid.includes("int"))
        testCases.push([
            `property ${property} on an interval is an int`,
            { ...data, intervals: [{ ...data.intervals[0], [property]: 42 }] },
        ]);
    if (!valid.includes("float"))
        testCases.push([
            `property ${property} on an interval is a float`,
            { ...data, intervals: [{ ...data.intervals[0], [property]: 42.5 }] },
        ]);
    if (!valid.includes("object"))
        testCases.push([
            `property ${property} on an interval is an object`,
            { ...data, intervals: [{ ...data.intervals[0], [property]: {} }] },
        ]);
    if (!valid.includes("array"))
        testCases.push([
            `property ${property} on an interval is an array`,
            { ...data, intervals: [{ ...data.intervals[0], [property]: [] }] },
        ]);
    if (!valid.includes("boolean"))
        testCases.push([
            `property ${property} on an interval is a boolean`,
            { ...data, intervals: [{ ...data.intervals[0], [property]: true }] },
        ]);
    if (!valid.includes("null"))
        testCases.push([
            `property ${property} is null`,
            { ...data, intervals: [{ ...data.intervals[0], [property]: null }] },
        ]);
    return testCases;
}

const missingInTimerTestCases = [
    (["title", "ttsVoice", "intervals"] as const).map(property => [`the ${property} is missing`, omit(data, property)]),
];

const badRequestTestCases = [
    ["the title is empty", { ...data, title: "" }],
    ["the title is too long", { ...data, title: faker.string.alphanumeric({ length: 101 }) }],
    ["the ttsVoice is empty", { ...data, ttsVoice: "" }],
    ["the ttsVoice is too long", { ...data, ttsVoice: faker.string.alphanumeric({ length: 201 }) }],
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
    ...missingInTimerTestCases,
    ...createInvalidTypeTestCases("title", ["string"]),
    ...createInvalidTypeTestCases("ttsVoice", ["string", "null"]),
    ...createInvalidTypeTestCases("intervals", ["null"]),
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
