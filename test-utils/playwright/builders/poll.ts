import { BASE_POLL, FULL_POLL } from "~~/test-utils/constants/poll";
import { type Method, TestBuilder } from "~~/test-utils/playwright/builders/base";

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
                    closesAt: poll.closesAt.toISOString(),
                    votes: votes.map(vote => vote.selection),
                },
            };
        },
        baseData: BASE_POLL,
        fullData: FULL_POLL,
        badPost: [],
        badPut: [],
        validPost: [],
        validPut: [],
        fixtureName: "poll",
        method,
    });
}
