import { arr, str, strArr } from "@@/test-utils/helpers/data";
import { omit } from "@@/test-utils/helpers/object";
import { BASE_INTERVAL, BASE_TIMER, HASH_40_CHARS } from "~~/test-utils/constants/timer";
import { createInvalidTypeTestCases } from "~~/test-utils/playwright/utils/helpers";

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

const topLevelCases = [
    ["the title is empty", withTimer("title", "")],
    ["the title is too long", withTimer("title", str({ length: 101 }))],
    ["the ttsVoices contain a value that is too long", withTimer("ttsVoices", [HASH_40_CHARS + str({ length: 461 })])],
    ["the ttsVoices contain a value that has an invalid hash", withTimer("ttsVoices", [str({ length: 41 })])],
    ["the ttsVoices contain a value that contains no voice", withTimer("ttsVoices", [HASH_40_CHARS.slice(0, 40)])],
    ["the ttsVoices array is too long", withTimer("ttsVoices", strArr({ arrLength: 101 }))],
    ["the title is missing", omit(BASE_TIMER, "title")],
    ["the ttsVoices are missing", omit(BASE_TIMER, "ttsVoices")],
    ["the intervals is missing", omit(BASE_TIMER, "intervals")],
    ["there are no intervals", withTimer("intervals", [])],
    ["there are too many intervals", withTimer("intervals", Array.from({ length: 101 }).fill(BASE_INTERVAL))],
];

const intervalLevelCases = [
    ["an interval has no duration", { ...BASE_TIMER, intervals: omit(BASE_INTERVAL, "duration") }],
    ["an interval has no repeatCount", { ...BASE_TIMER, intervals: omit(BASE_INTERVAL, "repeatCount") }],
    ["an interval title is too long", withInterval("title", str({ length: 101 }))],
    ["an interval repeatCount is too small", withInterval("repeatCount", 0)],
    ["an interval repeatCount is too large", withInterval("repeatCount", 101)],
    ["an interval duration is too small", withInterval("duration", 0)],
    ["an interval duration is too large", withInterval("duration", 3600001)],
    ["an interval has an empty beatPattern", withInterval("beatPattern", [])],
    ["an interval has a beatPattern that's too short", withInterval("beatPattern", ["low"])],
    ["an interval has a beatPattern that's too long", withInterval("beatPattern", arr("low", { length: 31 }))],
    ["an interval has a beatPattern that contains invalid values", withInterval("beatPattern", ["bananas"])],
];

const invalidTypeCases = [
    ...createInvalidTypeTestCases(BASE_TIMER, "title", { valid: ["string"] }),
    ...createInvalidTypeTestCases(BASE_TIMER, "ttsVoices", { valid: ["array"] }),
    ...createInvalidTypeTestCases(BASE_TIMER, "intervals", { valid: ["null"] }),
    ...createInvalidTypeIntervalTestCases("title", ["string", "null"]),
    ...createInvalidTypeIntervalTestCases("beatPattern", ["null"]),
    ...createInvalidTypeIntervalTestCases("duration", ["int"]),
    ...createInvalidTypeIntervalTestCases("repeatCount", ["int"]),
];

export const TIMER_BAD_REQUEST_TEST_CASES = [...topLevelCases, ...intervalLevelCases, ...invalidTypeCases];
