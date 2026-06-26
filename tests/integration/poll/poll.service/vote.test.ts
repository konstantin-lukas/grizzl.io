import DuplicateKeyError from "#server/core/errors/duplicate-key.error";
import InvalidIpError from "#server/core/errors/invalid-ip.error";
import InvalidVoteError from "#server/core/errors/invalid-vote.error";
import PollRepository from "#server/poll/repositories/poll.repository";
import VoteRepository from "#server/poll/repositories/vote.repository";
import PollService from "#server/poll/services/poll.service";
import { PollMethod, VoterIdentityMethod } from "#shared/poll/enums/method.enum";
import type { DBFixtures } from "~~/test-utils/database/fixture";
import { expect, test } from "~~/test-utils/vitest";

function makePollService(db: DBFixtures) {
    const pollRepository = new PollRepository(db.client);
    const voteRepository = new VoteRepository(db.client);
    return new PollService(pollRepository, voteRepository);
}

test("throws an InvalidIpError when the user is identified by cookie and none was provided", async ({ db, user }) => {
    const [poll] = await db.poll.insert(1, { userId: user.id, voterIdentityMethod: VoterIdentityMethod.COOKIE });
    const pollService = makePollService(db);
    await expect(pollService.vote(poll.id, { selection: [0, 1] }, "127.0.0.1")).rejects.toThrow(InvalidIpError);
});

test("throws an InvalidIpError when the user is identified by ip and none was provided", async ({ db, user }) => {
    const [poll] = await db.poll.insert(1, { userId: user.id, voterIdentityMethod: VoterIdentityMethod.IP });
    const pollService = makePollService(db);
    await expect(pollService.vote(poll.id, { selection: [0, 1] }, "", "mhh")).rejects.toThrow(InvalidIpError);
});

test("throws a DuplicateKeyError when the requesting user has already voted", async ({ db, user }) => {
    const [poll] = await db.poll.insert(1, { userId: user.id, voterIdentityMethod: VoterIdentityMethod.IP });
    await db.pollVote.insert(1, { pollId: poll.id, voterIdentifierHash: PollService.saltAndHash("127.0.0.1") });
    const pollService = makePollService(db);
    await expect(pollService.vote(poll.id, { selection: [0, 1] }, "127.0.0.1")).rejects.toThrow(DuplicateKeyError);
});

test("throws an InvalidVoteError when the vote selection is invalid", async ({ db, user }) => {
    const [poll] = await db.poll.insert(1, { userId: user.id, voterIdentityMethod: VoterIdentityMethod.IP });
    const pollService = makePollService(db);
    await expect(pollService.vote(poll.id, { selection: [10000] }, "127.0.0.1")).rejects.toThrow(InvalidVoteError);
});

test("creates a new vote on the given poll when the vote selection is correct and the requesting user hasn't voted yet", async ({
    db,
    user,
}) => {
    const [poll] = await db.poll.insert(1, {
        userId: user.id,
        voterIdentityMethod: VoterIdentityMethod.IP,
        choices: ["A", "B"],
        method: PollMethod.SCORE,
    });
    const pollService = makePollService(db);
    const selection = [7, 2];
    await expect(pollService.vote(poll.id, { selection }, "127.0.0.1")).resolves.not.toThrow();

    const votes = await db.pollVote.select();
    expect(votes).toStrictEqual([expect.objectContaining({ pollId: poll.id, selection })]);
});
