import NotFoundError from "#server/core/errors/not-found.error";
import PollRepository from "#server/poll/repositories/poll.repository";
import VoteRepository from "#server/poll/repositories/vote.repository";
import { VoterIdentityMethod } from "#shared/poll/enums/method.enum";
import type { PostPoll } from "#shared/poll/validators/poll.validator";
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

    async create(userId: string, poll: PostPoll) {
        return this.pollRepository.create(userId, poll);
    }

    public async setDeletedStatus(id: string, userId: string, isDeleted: boolean) {
        const operation = isDeleted ? "delete" : "undelete";
        const rowCount = await this.pollRepository[operation]({ id, userId });
        if (rowCount === 0) {
            const logMessage = `Unable to ${operation} poll with id ${id} and user id ${userId}.`;
            throw new NotFoundError("The requested poll does not exist.", logMessage);
        }
    }
    /* c8 ignore stop */

    static saltAndHash(str: string) {
        const runtimeConfig = useRuntimeConfig();
        const salt = runtimeConfig.voterIdentifierSalt;
        return hash("sha256", str + salt);
    }

    async getOne(id: string, ip: string, cookie?: string) {
        const poll = await this.pollRepository.findById(id);

        if (!poll) {
            const logMessage = `Unable to find poll with id ${id}`;
            throw new NotFoundError("Poll does not exist", logMessage);
        }

        const relevantIdentifier = poll.voterIdentityMethod === VoterIdentityMethod.COOKIE ? cookie : ip;

        if (!relevantIdentifier) return { ...poll, hasUserVoted: false };

        const identifierHash = PollService.saltAndHash(relevantIdentifier);
        const hasUserVoted = await this.voteRepository.hasVote(id, identifierHash);

        return { ...poll, hasUserVoted };
    }
}
