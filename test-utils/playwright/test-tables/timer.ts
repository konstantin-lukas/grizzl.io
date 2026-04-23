import { BASE_INTERVAL, BASE_TIMER, HASH_40_CHARS } from "~~/test-utils/constants/timer";
import { arr, str } from "~~/test-utils/helpers/data";
import { omit } from "~~/test-utils/helpers/object";
import { createInvalidTypeTestCases } from "~~/test-utils/playwright/test-tables/base";

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

const BAD_TOP_LEVEL_CASES = [
    ["the title is empty", withTimer("title", "")],
    ["the title is empty after trimming", withTimer("title", " ")],
    ["the title is too long", withTimer("title", str({ length: 101 }))],
    ["the ttsVoices contain a value that is too long", withTimer("ttsVoices", [HASH_40_CHARS + str({ length: 461 })])],
    ["the ttsVoices contain a value that has an invalid hash", withTimer("ttsVoices", [str({ length: 41 })])],
    ["the ttsVoices contain a value that contains no voice", withTimer("ttsVoices", [HASH_40_CHARS])],
    ["the ttsVoices array is too long", withTimer("ttsVoices", arr(BASE_TIMER.ttsVoices[0], { length: 101 }))],
    ["the title is missing", omit(BASE_TIMER, "title")],
    ["the ttsVoices are missing", omit(BASE_TIMER, "ttsVoices")],
    ["the intervals is missing", omit(BASE_TIMER, "intervals")],
    ["there are no intervals", withTimer("intervals", [])],
    ["there are too many intervals", withTimer("intervals", Array.from({ length: 101 }).fill(BASE_INTERVAL))],
];

const BAD_INTERVAL_LEVEL_CASES = [
    ["an interval has no duration", { ...BASE_TIMER, intervals: omit(BASE_INTERVAL, "duration") }],
    ["an interval has no repeatCount", { ...BASE_TIMER, intervals: omit(BASE_INTERVAL, "repeatCount") }],
    ["an interval title is too long", withInterval("title", str({ length: 101 }))],
    ["an interval repeatCount is too small", withInterval("repeatCount", 0)],
    ["an interval repeatCount is too large", withInterval("repeatCount", 101)],
    ["an interval duration is too small", withInterval("duration", 999)],
    ["an interval duration is negative", withInterval("duration", -1)],
    ["an interval duration is too large", withInterval("duration", 3600001)],
    ["an interval preparationTime is too small", withInterval("preparationTime", -1)],
    ["an interval preparationTime is too large", withInterval("preparationTime", 3600001)],
    ["an interval has an empty beatPattern", withInterval("beatPattern", [])],
    ["an interval has a beatPattern that's too short", withInterval("beatPattern", ["low"])],
    ["an interval has a beatPattern that's too long", withInterval("beatPattern", arr("low", { length: 31 }))],
    ["an interval has a beatPattern that contains invalid values", withInterval("beatPattern", ["bananas"])],
];

const TIMER_INVALID_TYPE_CASES = [
    ...createInvalidTypeTestCases(BASE_TIMER, "title", { valid: ["string"] }),
    ...createInvalidTypeTestCases(BASE_TIMER, "ttsVoices", { valid: ["array"] }),
    ...createInvalidTypeTestCases(BASE_TIMER, "intervals", { valid: ["null"] }),
    ...createInvalidTypeIntervalTestCases("title", ["string", "null"]),
    ...createInvalidTypeIntervalTestCases("beatPattern", ["null"]),
    ...createInvalidTypeIntervalTestCases("duration", ["int"]),
    ...createInvalidTypeIntervalTestCases("repeatCount", ["int"]),
];

export const TIMER_BAD_REQUEST_TEST_CASES = [
    ...BAD_TOP_LEVEL_CASES,
    ...BAD_INTERVAL_LEVEL_CASES,
    ...TIMER_INVALID_TYPE_CASES,
];

export const VALID_TIMER_LEVEL_CASES = [
    ["the title is just long enough", withTimer("title", "a")],
    ["the title is just short enough", withTimer("title", str({ length: 100 }))],
    ["the title is just short enough after trimming", withTimer("title", ` ${str({ length: 100 })} `)],
    ["the ttsVoices are just short enough", withTimer("ttsVoices", [HASH_40_CHARS + str({ length: 460 })])],
    ["the ttsVoices are just long enough", withTimer("ttsVoices", [`${HASH_40_CHARS}a`])],
    ["the ttsVoices array is just short enough", withTimer("ttsVoices", arr(BASE_TIMER.ttsVoices[0], { length: 100 }))],
    ["the ttsVoices array is empty", withTimer("ttsVoices", [])],
    ["there are not too many intervals", withTimer("intervals", Array.from({ length: 100 }).fill(BASE_INTERVAL))],
];

export const VALID_INTERVAL_LEVEL_CASES = [
    ["the interval titles are just long enough", withInterval("title", "a")],
    ["the interval titles are just short enough", withInterval("title", str({ length: 100 }))],
    ["the interval titles are just short enough after trimming", withInterval("title", ` ${str({ length: 100 })} `)],
    ["the interval durations are just large enough", withInterval("duration", 1000)],
    ["the interval durations are just small enough", withInterval("duration", 3600000)],
    ["an interval repeatCount is just large enough", withInterval("repeatCount", 1)],
    ["an interval repeatCount is just small enough", withInterval("repeatCount", 100)],
    ["an interval preparationTime is zero", withInterval("preparationTime", 0)],
    ["an interval preparationTime is positive", withInterval("preparationTime", 1000)],
    ["an interval preparationTime is just small enough", withInterval("preparationTime", 3600000)],
    ["an interval has a beatPattern that's just long enough", withInterval("beatPattern", ["low", "low"])],
    ["an interval has a beatPattern that's just short enough", withInterval("beatPattern", arr("low", { length: 30 }))],
];

export const TIMER_VALID_REQUEST_TEST_CASES = [...VALID_TIMER_LEVEL_CASES, ...VALID_INTERVAL_LEVEL_CASES];
