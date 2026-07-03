import { VoterIdentityMethod } from "#shared/poll/enums/method.enum";
import { hash } from "crypto";
import { expect, test } from "~~/test-utils/playwright";
import { withoutAuth } from "~~/test-utils/playwright/utils/auth";

withoutAuth(() => {
    test("allows getting a poll even when not authenticated", async ({ request, db }) => {
        const [poll] = await db.poll.insert(1);
        const response = await request.get(`/api/polls/${poll.id}`);

        expect(response.status()).toBe(200);
        expect(await response.json()).toStrictEqual({
            choices: poll.choices,
            title: poll.title,
            closesAt: poll.closesAt,
            method: poll.method,
            id: poll.id,
            hasUserVoted: false,
            voterIdentityMethod: poll.voterIdentityMethod,
            majorityWinner: false,
            createdAt: poll.createdAt.toISOString(),
            results: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            turnout: 0,
            winners: [],
        });
    });
});

test("returns true for userHasVoted when the voterIdentityMethod is 'cookie' and the cookie is associated with a vote on the same poll", async ({
    db,
    context,
}) => {
    await context.addCookies([{ name: "voter_identifier", value: "123", domain: "grizzl.localhost", path: "/" }]);
    const [poll] = await db.poll.insert(1, { voterIdentityMethod: VoterIdentityMethod.COOKIE });
    await db.pollVote.insert(1, { pollId: poll.id, voterIdentifierHash: hash("sha256", "123Cucumber") });
    const response = await context.request.get(`/api/polls/${poll.id}`);
    expect(await response.json()).toHaveProperty("hasUserVoted", true);
});

test("return a 404 error when the requested poll doesn't exist", async ({ request }) => {
    const response = await request.get(`/api/polls/2222222222222222`);
    expect(response.status()).toBe(404);
});
