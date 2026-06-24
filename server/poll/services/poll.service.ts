import NotFoundError from "#server/core/errors/not-found.error";
import PollRepository from "#server/poll/repositories/poll.repository";
import VoteRepository from "#server/poll/repositories/vote.repository";
import { hash } from "crypto";

export default class PollService {
    static readonly deps = [PollRepository, VoteRepository];

    constructor(
        private readonly pollRepository: PollRepository,
        private readonly voteRepository: VoteRepository,
    ) {}

    /* c8 ignore start */
    async getCollection(userId: string) {
        return this.pollRepository.findByUserId(userId);
    }
    /* c8 ignore stop */

    static hashIp(ip: string) {
        return hash("sha256", ip);
    }

    async getOne(id: string, ip: string) {
        const poll = await this.pollRepository.findById(id);

        if (!poll) {
            const logMessage = `Unable to find poll with id ${id}`;
            throw new NotFoundError("Poll does not exist", logMessage);
        }

        const ipHash = PollService.hashIp(ip);
        const userHasVoted = await this.voteRepository.hasVote(id, ipHash);

        return { ...poll, userHasVoted };
    }
}
