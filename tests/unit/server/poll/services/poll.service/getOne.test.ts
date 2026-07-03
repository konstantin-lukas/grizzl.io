import NotFoundError from "#server/core/errors/not-found.error";
import PollService from "#server/poll/services/poll.service";
import { PollMethod, VoterIdentityMethod } from "#shared/poll/enums/method.enum";
import { expect, test, vi } from "vitest";

const pollRepository = {
    findById: vi.fn(),
};

const voteRepository = {
    hasVote: vi.fn(),
};
const service = new PollService(pollRepository as never, voteRepository as never);

vi.spyOn(PollService, "saltAndHash").mockReturnValue("hashed-id");

test("returns the poll with calculated results", async () => {
    pollRepository.findById.mockResolvedValue({
        id: "poll-1",
        method: PollMethod.PLURALITY,
        voterIdentityMethod: VoterIdentityMethod.IP,
        majorityWinner: false,
        choices: ["A", "B"],
        votes: [[0], [0], [1]],
    });

    voteRepository.hasVote.mockResolvedValue(true);

    const result = await service.getOne("poll-1", "127.0.0.1");

    expect(result).toEqual({
        id: "poll-1",
        method: PollMethod.PLURALITY,
        voterIdentityMethod: VoterIdentityMethod.IP,
        majorityWinner: false,
        choices: ["A", "B"],
        hasUserVoted: true,
        turnout: 3,
        results: [2, 1],
        winners: [0],
    });
});

test("uses the cookie when voter identity method is COOKIE", async () => {
    pollRepository.findById.mockResolvedValue({
        id: "poll-1",
        method: PollMethod.PLURALITY,
        voterIdentityMethod: VoterIdentityMethod.COOKIE,
        majorityWinner: false,
        choices: ["A", "B"],
        votes: [],
    });

    voteRepository.hasVote.mockResolvedValue(false);

    await service.getOne("poll-1", "1.2.3.4", "cookie");

    expect(PollService.saltAndHash).toHaveBeenCalledWith("cookie");
});

test("uses the ip when voter identity method is IP", async () => {
    pollRepository.findById.mockResolvedValue({
        id: "poll-1",
        method: PollMethod.PLURALITY,
        voterIdentityMethod: VoterIdentityMethod.IP,
        majorityWinner: false,
        choices: ["A", "B"],
        votes: [],
    });

    voteRepository.hasVote.mockResolvedValue(false);

    await service.getOne("poll-1", "8.8.8.8");

    expect(PollService.saltAndHash).toHaveBeenCalledWith("8.8.8.8");
});

test("returns no winners when no candidate has a majority and majorityWinner is enabled", async () => {
    pollRepository.findById.mockResolvedValue({
        id: "poll-1",
        method: PollMethod.PLURALITY,
        voterIdentityMethod: VoterIdentityMethod.IP,
        majorityWinner: true,
        choices: ["A", "B"],
        votes: [[0], [1]],
    });

    voteRepository.hasVote.mockResolvedValue(false);

    const result = await service.getOne("poll-1", "127.0.0.1");

    expect(result.results).toEqual([1, 1]);
    expect(result.winners).toEqual([]);
});

test("returns tied winners when there is a tie and no majority is required", async () => {
    pollRepository.findById.mockResolvedValue({
        id: "poll-1",
        method: PollMethod.PLURALITY,
        voterIdentityMethod: VoterIdentityMethod.IP,
        majorityWinner: false,
        choices: ["A", "B"],
        votes: [[0], [1]],
    });

    voteRepository.hasVote.mockResolvedValue(false);

    const result = await service.getOne("poll-1", "127.0.0.1");

    expect(result.results).toEqual([1, 1]);
    expect(result.winners).toEqual([0, 1]);
});

test("throws a NotFoundError when the poll does not exist", async () => {
    pollRepository.findById.mockResolvedValue(undefined);

    await expect(service.getOne("missing", "127.0.0.1")).rejects.toBeInstanceOf(NotFoundError);

    expect(voteRepository.hasVote).not.toHaveBeenCalled();
});
