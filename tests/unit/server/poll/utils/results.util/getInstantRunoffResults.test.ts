import { getInstantRunoffResults } from "#server/poll/utils/results.util";
import { expect, test } from "vitest";

test.each([
    // REGULAR VOTES
    {
        votes: [
            [1, 0, 3, 2],
            [1, 2, 0, 3],
            [2, 3, 0, 1],
            [2, 3, 1, 0],
            [0, 3, 2, 1],
        ],
        expected: [0, 2, 3, 0],
        choiceCount: 4,
    },
    // SINGLE VOTE
    {
        votes: [[1, 3, 2, 0]],
        expected: [0, 1, 0, 0],
        choiceCount: 4,
    },
    // VOTES WHERE LAST CANDIDATE FROM FIRST ROUND APPEARS AS SECOND OPTION IN SOME VOTES
    {
        votes: [
            [1, 0, 3, 2],
            [2, 0, 1, 3],
            [3, 0, 2, 1],
        ],
        expected: [0, 1, 1, 1],
        choiceCount: 4,
    },
    // VOTES WHERE TWO ELIMINATED CANDIDATES ARE FOUND IN THE SECOND ROUND
    {
        votes: [
            [0, 3, 4, 1, 2],
            [1, 3, 4, 0, 2],
            [2, 3, 4, 0, 1],
        ],
        expected: [2, 1, 0, 0, 0],
        choiceCount: 5,
    },
    {
        votes: [
            [5, 3, 4, 1, 0, 2],
            [0, 3, 4, 1, 2, 5],
            [1, 3, 4, 0, 2, 5],
            [2, 3, 4, 0, 1, 5],
        ],
        expected: [2, 2, 0, 0, 0, 0],
        choiceCount: 6,
    },
    // TWO LOSING CANDIDATES IN FIRST ROUND
    {
        votes: [
            [0, 1, 2],
            [2, 1, 0],
        ],
        expected: [1, 0, 1],
        choiceCount: 3,
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
    // NO VOTES
    {
        votes: [],
        expected: [0, 0],
        choiceCount: 2,
    },
])("should return $expected given $votes for choiceCount $choiceCount", ({ votes, choiceCount, expected }) => {
    expect(getInstantRunoffResults(votes, choiceCount)).toStrictEqual(expected);
});
