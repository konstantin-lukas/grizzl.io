import { PollMethod, VoterIdentityMethod } from "#shared/poll/enums/method.enum";
import { BASE_POLL } from "~~/test-utils/constants/poll";
import { str, strArr } from "~~/test-utils/helpers/data";
import { omit } from "~~/test-utils/helpers/object";
import { createInvalidTypeTestCases } from "~~/test-utils/playwright/test-tables/base";

function withPoll(property: keyof typeof BASE_POLL, value: unknown) {
    return { ...BASE_POLL, [property]: value };
}

const POLL_INVALID_TYPE_CASES = [
    ...createInvalidTypeTestCases(BASE_POLL, "title", { valid: ["string"] }),
    ...createInvalidTypeTestCases(BASE_POLL, "closesAt", { valid: ["null"] }),
    ...createInvalidTypeTestCases(BASE_POLL, "method", { valid: [] }),
    ...createInvalidTypeTestCases(BASE_POLL, "choices", { valid: ["array"] }),
    ...createInvalidTypeTestCases(BASE_POLL, "majorityWinner", { valid: ["boolean"] }),
    ...createInvalidTypeTestCases(BASE_POLL, "voterIdentityMethod", { valid: [] }),
] as never;

const POLL_INVALID_DATA_CASES = [
    ["the title is empty", withPoll("title", "")],
    ["the title is empty after trimming", withPoll("title", " ")],
    ["the title is too long", withPoll("title", str({ length: 201 }))],
    ["the title is missing", omit(BASE_POLL, "title")],
    ["closesAt is not at least 5 minutes in the future", withPoll("closesAt", new Date().toISOString())],
    ["closesAt is missing", omit(BASE_POLL, "closesAt")],
    ["method is missing", omit(BASE_POLL, "method")],
    ["choices is missing", omit(BASE_POLL, "choices")],
    ["choices has only one element", withPoll("choices", strArr({ arrLength: 1 }))],
    ["choices contain an element that is too short", withPoll("choices", [str(), ""])],
    ["choices contain an element that is too long", withPoll("choices", [str(), str({ length: 101 })])],
    ["choices has too many elements", withPoll("choices", strArr({ arrLength: 21 }))],
    ["choices is empty", withPoll("choices", [])],
    ["majorityWinner is missing", omit(BASE_POLL, "majorityWinner")],
    ["voterIdentityMethod is missing", omit(BASE_POLL, "voterIdentityMethod")],
];

const future = new Date(Date.now() + 4 * 60 * 1000);

export const POLL_VALID_REQUEST_TEST_CASES = [
    ["the title is just long enough", withPoll("title", "a")],
    ["the title is just short enough", withPoll("title", str({ length: 200 }))],
    [
        "the title is just short enough after trimming",
        withPoll("title", ` ${str({ length: 200 })} `),
        withPoll("title", str({ length: 200 })),
    ],
    [
        "closesAt is at least 3 minutes in the future",
        withPoll("closesAt", future.toISOString()),
        withPoll("closesAt", future),
    ],
    ...Object.values(PollMethod).map(method => [`the method is ${method}`, withPoll("method", method)]),
    ...Object.values(VoterIdentityMethod).map(method => [
        `the voterIdentityMethod is ${method}`,
        withPoll("voterIdentityMethod", method),
    ]),
    ["choices are just long enough", withPoll("choices", strArr({ arrLength: 2, strLength: 1 }))],
    ["choices are just short enough", withPoll("choices", strArr({ arrLength: 2, strLength: 100 }))],
    [
        "choices are just short enough after trimming",
        withPoll("choices", ["a", ` ${str({ length: 100 })} `]),
        withPoll("choices", ["a", str({ length: 100 })]),
    ],
    ["choices has enough elements", withPoll("choices", strArr({ arrLength: 2 }))],
    ["majorityWinner is true", withPoll("majorityWinner", true)],
    ["majorityWinner is false", withPoll("majorityWinner", false)],
];

export const POLL_BAD_REQUEST_TEST_CASES = [...POLL_INVALID_TYPE_CASES, ...POLL_INVALID_DATA_CASES];
