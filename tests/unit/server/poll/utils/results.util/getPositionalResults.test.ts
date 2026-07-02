import { getPositionalResults } from "#server/poll/utils/results.util";
import { expect, test } from "vitest";

test.each([
    // NO VOTES
    {
        votes: [],
        expected: [0, 0, 0, 0],
        choiceCount: 4,
    },
    // SINGLE VOTE
    {
        votes: [[1, 3, 2, 0]],
        expected: [1, 4, 2, 3],
        choiceCount: 4,
    },
    // REGULAR VOTES
    {
        votes: [
            [1, 3, 2, 0],
            [2, 1, 0, 3],
            [1, 2, 0, 3],
            [3, 2, 0, 1],
            [0, 3, 1, 2],
        ],
        expected: [11, 14, 13, 12],
        choiceCount: 4,
    },
    // TIE
    {
        votes: [
            [0, 1],
            [1, 0],
        ],
        expected: [3, 3],
        choiceCount: 2,
    },
])("should return $expected given $votes for choiceCount $choiceCount", ({ votes, choiceCount, expected }) => {
    expect(getPositionalResults(votes, choiceCount)).toStrictEqual(expected);
});
