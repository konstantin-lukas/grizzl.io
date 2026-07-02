import { getScoreResults } from "#server/poll/utils/results.util";
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
        votes: [[9, 3, 1, 10]],
        expected: [9, 3, 1, 10],
        choiceCount: 4,
    },
    // TIE
    {
        votes: [
            [0, 1],
            [1, 0],
        ],
        expected: [1, 1],
        choiceCount: 2,
    },
    // REGULAR VOTES + TIE
    {
        votes: [
            [9, 3, 1, 10],
            [2, 5, 2, 1],
            [1, 7, 2, 9],
            [10, 2, 2, 2],
        ],
        expected: [22, 17, 7, 22],
        choiceCount: 4,
    },
])("should return $expected given $votes for choiceCount $choiceCount", ({ votes, choiceCount, expected }) => {
    expect(getScoreResults(votes, choiceCount)).toStrictEqual(expected);
});
