import NotFoundError from "#server/core/errors/not-found.error";
import PollRepository from "#server/poll/repositories/poll.repository";
import VoteRepository from "#server/poll/repositories/vote.repository";
import PollService from "#server/poll/services/poll.service";
import { VoterIdentityMethod } from "#shared/poll/enums/method.enum";
import type { DBFixtures } from "~~/test-utils/database/fixture";
import { expect, test } from "~~/test-utils/vitest";

function makePollService(db: DBFixtures) {
    const pollRepository = new PollRepository(db.client);
    const voteRepository = new VoteRepository(db.client);
    return new PollService(pollRepository, voteRepository);
}

test("throws a NotFoundError when the requested poll doesn't exist", async ({ db }) => {
    const pollService = makePollService(db);
    await expect(pollService.getOne("123", "")).rejects.toThrow(NotFoundError);
});

test("returns with userHasVoted as false when voterIdentityMethod is 'cookie' but no cookie was provided", async ({
    db,
    user,
}) => {
    const pollService = makePollService(db);

    const [poll] = await db.poll.insert(1, { userId: user.id, voterIdentityMethod: VoterIdentityMethod.COOKIE });
    const foundPoll = await pollService.getOne(poll.id, "127.0.0.1");
    expect(foundPoll).toHaveProperty("hasUserVoted", false);
});

test("returns with userHasVoted as false when voterIdentityMethod is 'ip' but no ip was provided", async ({
    db,
    user,
}) => {
    const pollService = makePollService(db);

    const [poll] = await db.poll.insert(1, { userId: user.id, voterIdentityMethod: VoterIdentityMethod.IP });
    const foundPoll = await pollService.getOne(poll.id, "", "mhh");
    expect(foundPoll).toHaveProperty("hasUserVoted", false);
});

test("returns with userHasVoted as true when voterIdentityMethod is 'ip' and the ip was already used to vote", async ({
    db,
    user,
}) => {
    const ip = "127.0.0.1";
    const pollService = makePollService(db);

    const [poll] = await db.poll.insert(1, { userId: user.id, voterIdentityMethod: VoterIdentityMethod.IP });
    await db.pollVote.insert(1, { pollId: poll.id, voterIdentifierHash: PollService.saltAndHash(ip) });
    const foundPoll = await pollService.getOne(poll.id, ip);
    expect(foundPoll).toHaveProperty("hasUserVoted", true);
});

test("returns with userHasVoted as true when voterIdentityMethod is 'cookie' and the cookie was already used to vote", async ({
    db,
    user,
}) => {
    const cookie = "123";
    const pollService = makePollService(db);

    const [poll] = await db.poll.insert(1, { userId: user.id, voterIdentityMethod: VoterIdentityMethod.COOKIE });
    await db.pollVote.insert(1, { pollId: poll.id, voterIdentifierHash: PollService.saltAndHash(cookie) });
    const foundPoll = await pollService.getOne(poll.id, "127.0.0.1", cookie);
    expect(foundPoll).toHaveProperty("hasUserVoted", true);
});
