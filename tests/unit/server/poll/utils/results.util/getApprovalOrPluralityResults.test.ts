import { getApprovalOrPluralityResults } from "#server/poll/utils/results.util";
import { expect, test } from "vitest";

test.each([
    // NO VOTES (PLURALITY)
    {
        votes: [],
        expected: [0, 0, 0, 0],
        choiceCount: 4,
    },
    // SINGLE VOTE (PLURALITY)
    {
        votes: [[3]],
        expected: [0, 0, 0, 1],
        choiceCount: 4,
    },
    // REGULAR VOTES (PLURALITY)
    {
        votes: [[3], [0], [2], [0]],
        expected: [2, 0, 1, 1],
        choiceCount: 4,
    },
    // NO VOTES (APPROVAL)
    {
        votes: [],
        expected: [0, 0, 0, 0],
        choiceCount: 4,
    },
    // SINGLE VOTE (APPROVAL)
    {
        votes: [[3]],
        expected: [0, 0, 0, 1],
        choiceCount: 4,
    },
    // REGULAR VOTES (APPROVAL)
    {
        votes: [
            [3, 2],
            [3, 0],
            [1, 2, 3],
            [0, 3],
        ],
        expected: [2, 1, 2, 4],
        choiceCount: 4,
    },
])("should return $expected given $votes for choiceCount $choiceCount", ({ votes, choiceCount, expected }) => {
    expect(getApprovalOrPluralityResults(votes, choiceCount)).toStrictEqual(expected);
});
