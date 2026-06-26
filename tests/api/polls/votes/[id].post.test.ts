import { VOTER_IDENTIFIER_COOKIE_NAME } from "#shared/poll/constants/cookie.constant";
import { PollMethod, VoterIdentityMethod } from "#shared/poll/enums/method.enum";
import { expect, test } from "~~/test-utils/playwright";
import { withoutAuth } from "~~/test-utils/playwright/utils/auth";

function testVote(title: string) {
    test(title, async ({ request, db }) => {
        const [poll] = await db.poll.insert(1, {
            choices: ["A", "B"],
            method: PollMethod.RUNOFF,
        });
        const selection = [0, 1];
        const response = await request.post(`/api/polls/${poll.id}/votes`, { data: { selection } });
        const votes = await db.pollVote.select();
        expect(response.status()).toBe(201);
        expect(votes).toStrictEqual([expect.objectContaining({ pollId: poll.id, selection })]);
    });
}

withoutAuth(() => {
    testVote("allows voting on a poll even when not authenticated");
});

testVote("allows voting on a poll when authenticated");

test("returns a 409 when the user has already voted", async ({ request, db }) => {
    const [poll] = await db.poll.insert(1, {
        choices: ["A", "B"],
        method: PollMethod.RUNOFF,
        voterIdentityMethod: VoterIdentityMethod.COOKIE,
    });
    const selection = [0, 1];
    await request.post(`/api/polls/${poll.id}/votes`, { data: { selection } });
    const response = await request.post(`/api/polls/${poll.id}/votes`, { data: { selection } });
    const votes = await db.pollVote.select();

    expect(response.status()).toBe(409);
    expect(votes).toHaveLength(1);
});

test("returns a 404 when the poll doesn't exist", async ({ request }) => {
    const response = await request.post(`/api/polls/2222222222222222/votes`, { data: { selection: [0, 1] } });

    expect(response.status()).toBe(404);
});

test("returns a 400 when the selected choice indices are invalid", async ({ request, db }) => {
    const [poll] = await db.poll.insert(1, {
        choices: ["A", "B"],
        method: PollMethod.RUNOFF,
        voterIdentityMethod: VoterIdentityMethod.COOKIE,
    });
    const response = await request.post(`/api/polls/${poll.id}/votes`, { data: { selection: [0, 2] } });
    const votes = await db.pollVote.select();

    expect(response.status()).toBe(400);
    expect(votes).toHaveLength(0);
});

test("sets a new identifier cookie when none exists", async ({ request, db }) => {
    const [poll] = await db.poll.insert(1, { choices: ["A", "B"], method: PollMethod.RUNOFF });
    const response = await request.post(`/api/polls/${poll.id}/votes`, { data: { selection: [0, 1] } });

    expect(response.status()).toBe(201);
    const { cookies } = await request.storageState();

    expect(cookies).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                name: VOTER_IDENTIFIER_COOKIE_NAME,
                value: expect.stringMatching(/^.{16}$/),
            }),
        ]),
    );
});

test("only allows voting once", async ({ context, db }) => {
    await context.addCookies([{ name: "voter_identifier", value: "123", domain: "grizzl.localhost", path: "/" }]);
    const [poll] = await db.poll.insert(1, {
        choices: ["A", "B"],
        method: PollMethod.RUNOFF,
        voterIdentityMethod: VoterIdentityMethod.COOKIE,
    });
    await Promise.all(
        Array.from({ length: 20 }).map(() =>
            context.request.post(`/api/polls/${poll.id}/votes`, { data: { selection: [0, 1] } }),
        ),
    );
    const votes = await db.pollVote.select();
    expect(votes).toHaveLength(1);
});
