import { BASE_POLL, FULL_POLL } from "~~/test-utils/constants/poll";
import { type Method, TestBuilder } from "~~/test-utils/playwright/builders/base";
import { POLL_BAD_REQUEST_TEST_CASES, POLL_VALID_REQUEST_TEST_CASES } from "~~/test-utils/playwright/test-tables/poll";

export function makePollTestBuilder(method: Method) {
    return new TestBuilder({
        fixtureProvider: async ({ db, userId }) => {
            const [poll] = await db.poll.insert(1, userId ? { userId } : undefined);
            const votes = await db.pollVote.insert(3, { pollId: poll.id });
            return {
                id: poll.id,
                data: poll,
                basePath: "/api/polls",
                fullPath: `/api/polls/${poll.id}`,
                getDatabaseOverrides: {
                    closesAt: poll.closesAt?.toISOString() ?? null,
                    votes: votes.map(vote => vote.selection),
                },
            };
        },
        baseData: BASE_POLL,
        fullData: FULL_POLL,
        badPost: POLL_BAD_REQUEST_TEST_CASES,
        badPut: [],
        validPost: POLL_VALID_REQUEST_TEST_CASES,
        validPut: [],
        fixtureName: "poll",
        method,
    });
}
