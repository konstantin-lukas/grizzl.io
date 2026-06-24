import NotFoundError from "#server/core/errors/not-found.error";
import PollRepository from "#server/poll/repositories/poll.repository";
import VoteRepository from "#server/poll/repositories/vote.repository";
import { VoterIdentityMethod } from "#shared/poll/enums/method.enum";
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

    static saltAndHash(ip: string) {
        const runtimeConfig = useRuntimeConfig();
        const salt = runtimeConfig.poll.voterIdentifierSalt;
        return hash("sha256", ip + salt);
    }

    async getOne(id: string, ip: string, cookie?: string) {
        const poll = await this.pollRepository.findById(id);

        if (!poll) {
            const logMessage = `Unable to find poll with id ${id}`;
            throw new NotFoundError("Poll does not exist", logMessage);
        }

        const relevantIdentifier = poll.voterIdentityMethod === VoterIdentityMethod.COOKIE ? cookie : ip;

        if (!relevantIdentifier) return { ...poll, userHasVoted: false };

        const identifierHash = PollService.saltAndHash(relevantIdentifier);
        const userHasVoted = await this.voteRepository.hasVote(id, identifierHash);

        return { ...poll, userHasVoted };
    }
}
