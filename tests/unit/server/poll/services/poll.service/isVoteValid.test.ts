import PollService from "#server/poll/services/poll.service";
import { PollMethod } from "#shared/poll/enums/method.enum";
import type { PostPoll } from "#shared/poll/validators/poll.validator";
import { expect, test } from "vitest";

const approvalTestCases = [
    { selection: [], expected: true },
    { selection: [0], expected: true },
    { selection: [1], expected: true },
    { selection: [0, 1], expected: true },
    { selection: [1, 0], expected: true },
    { selection: [-1], expected: false },
    { selection: [2], expected: false },
    { selection: [0, 0], expected: false },
    { selection: [0, 0, 1], expected: false },
].map(testCase => ({ ...testCase, method: PollMethod.APPROVAL }));

const scoreTestCases = [
    { selection: [5, 1], expected: true },
    { selection: [10, 4], expected: true },
    { selection: [], expected: false },
    { selection: [5], expected: false },
    { selection: [-1, 4], expected: false },
    { selection: [0, 4], expected: false },
    { selection: [1, 11], expected: false },
    { selection: [1, 1, 1], expected: false },
].map(testCase => ({ ...testCase, method: PollMethod.SCORE }));

const pluralityTestCases = [
    { selection: [0], expected: true },
    { selection: [1], expected: true },
    { selection: [], expected: false },
    { selection: [-1], expected: false },
    { selection: [0, 1], expected: false },
].map(testCase => ({
    ...testCase,
    method: PollMethod.PLURALITY,
}));

const positionalAndRunoffTestCases = [
    { selection: [0, 1], expected: true },
    { selection: [1, 0], expected: true },
    { selection: [2, 0], expected: false },
    { selection: [], expected: false },
    { selection: [0], expected: false },
    { selection: [-1, -1], expected: false },
    { selection: [0, 0], expected: false },
    { selection: [0, 0, 0], expected: false },
];

const positionalTestCases = positionalAndRunoffTestCases.map(testCase => ({
    ...testCase,
    method: PollMethod.POSITIONAL,
}));

const runoffTestCases = positionalAndRunoffTestCases.map(testCase => ({
    ...testCase,
    method: PollMethod.RUNOFF,
}));

const testCases = [
    ...approvalTestCases,
    ...scoreTestCases,
    ...pluralityTestCases,
    ...positionalTestCases,
    ...runoffTestCases,
];

test.each(testCases)(
    "returns $expected when selection is $selection on $method poll with 2 choices",
    ({ method, selection, expected }) => {
        const result = PollService.isVoteValid({ method, choices: ["A", "B"] } as PostPoll, { selection });
        expect(result).toBe(expected);
    },
);
