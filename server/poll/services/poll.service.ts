import DuplicateKeyError from "#server/core/errors/duplicate-key.error";
import InvalidIpError from "#server/core/errors/invalid-ip.error";
import NotFoundError from "#server/core/errors/not-found.error";
import OutOfBoundsError from "#server/core/errors/out-of-bounds.error";
import type { DatabaseTransaction } from "#server/core/repositories/base.repository";
import PollRepository from "#server/poll/repositories/poll.repository";
import VoteRepository from "#server/poll/repositories/vote.repository";
import { PollMethod, VoterIdentityMethod } from "#shared/poll/enums/method.enum";
import type { PostPoll } from "#shared/poll/validators/poll.validator";
import type { PostVote } from "#shared/poll/validators/vote.validator";
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

    private async getPoll(id: string, ctx?: DatabaseTransaction) {
        const poll = await this.pollRepository.findById(id, ctx);

        if (!poll) {
            const logMessage = `Unable to find poll with id ${id}`;
            throw new NotFoundError("Poll does not exist", logMessage);
        }

        return poll;
    }

    async getOne(id: string, ip: string, cookie?: string) {
        const poll = await this.getPoll(id);
        const relevantIdentifier = poll.voterIdentityMethod === VoterIdentityMethod.COOKIE ? cookie : ip;

        if (!relevantIdentifier) return { ...poll, hasUserVoted: false };

        const identifierHash = PollService.saltAndHash(relevantIdentifier);
        const hasUserVoted = await this.voteRepository.hasVote(id, identifierHash);

        return { ...poll, hasUserVoted };
    }

    static isVoteValid(poll: PostPoll, vote: PostVote) {
        const sameLength = vote.selection.length === poll.choices.length;
        const containsOnlyChoiceIndices = vote.selection.every(choice => choice < poll.choices.length);
        const containsOnlyUniqueItems = vote.selection.length === new Set(vote.selection).size;

        if (poll.method === PollMethod.APPROVAL) {
            return containsOnlyChoiceIndices && containsOnlyUniqueItems;
        }

        if (poll.method === PollMethod.SCORE) {
            const allVotesOnScale = vote.selection.every(choice => choice >= 1 && choice <= 10);
            return sameLength && allVotesOnScale;
        }

        if (poll.method == PollMethod.PLURALITY) {
            const onlyOneVote = vote.selection.length === 1;
            return containsOnlyChoiceIndices && onlyOneVote;
        }

        return containsOnlyUniqueItems && containsOnlyChoiceIndices && sameLength;
    }

    async vote(id: string, vote: PostVote, ip: string, cookie?: string) {
        return this.pollRepository.transaction(async tx => {
            const poll = await this.getPoll(id, tx);
            const relevantIdentifier = poll.voterIdentityMethod === VoterIdentityMethod.COOKIE ? cookie : ip;

            if (!relevantIdentifier) {
                const logMessage = `Unable to get identifier of type "${poll.voterIdentityMethod}". Value is "${relevantIdentifier}".`;
                throw new InvalidIpError("Unable to identify user", logMessage);
            }

            const identifierHash = PollService.saltAndHash(relevantIdentifier);
            await this.pollRepository.advisoryLock(`vote-${id}-${identifierHash}`, tx);
            const hasUserVoted = await this.voteRepository.hasVote(id, identifierHash, tx);

            if (hasUserVoted) {
                const logMessage = `Cannot create vote. Vote for user ${identifierHash} (${poll.voterIdentityMethod}) already exists on poll with id ${id}.`;
                throw new DuplicateKeyError("User has already voted.", logMessage);
            }

            const isVoteValid = PollService.isVoteValid(poll, vote);

            if (!isVoteValid) {
                const logMessage = `Cannot create vote. Vote is invalid. Method: ${poll.method}. Vote: ${vote.selection}`;
                throw new OutOfBoundsError("User has already voted.", logMessage);
            }

            return this.voteRepository.create(id, identifierHash, vote, tx);
        });
    }
}
