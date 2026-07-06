import DuplicateKeyError from "#server/core/errors/duplicate-key.error";
import InvalidIpError from "#server/core/errors/invalid-ip.error";
import InvalidVoteError from "#server/core/errors/invalid-vote.error";
import NotFoundError from "#server/core/errors/not-found.error";
import type { DatabaseTransaction } from "#server/core/repositories/base.repository";
import PollRepository from "#server/poll/repositories/poll.repository";
import VoteRepository from "#server/poll/repositories/vote.repository";
import {
    getApprovalOrPluralityResults,
    getInstantRunoffResults,
    getPositionalResults,
    getScoreResults,
} from "#server/poll/utils/results.util";
import { PollMethod, VoterIdentityMethod } from "#shared/poll/enums/method.enum";
import type { PostPoll } from "#shared/poll/validators/poll.validator";
import { type PostVote, SCORE_VOTE_MAX_POINTS, SCORE_VOTE_MIN_POINTS } from "#shared/poll/validators/vote.validator";
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
        const { votes, ...poll } = await this.getPoll(id);
        const identifier = poll.voterIdentityMethod === VoterIdentityMethod.COOKIE ? cookie : ip;

        const hasUserVoted =
            !!identifier && (await this.voteRepository.hasVote(id, PollService.saltAndHash(identifier)));

        const resultCalculators = {
            [PollMethod.SCORE]: getScoreResults,
            [PollMethod.RUNOFF]: getInstantRunoffResults,
            [PollMethod.POSITIONAL]: getPositionalResults,
            [PollMethod.APPROVAL]: getApprovalOrPluralityResults,
            [PollMethod.PLURALITY]: getApprovalOrPluralityResults,
        };

        const results = resultCalculators[poll.method](votes, poll.choices.length);
        const turnout = votes.length;
        const mostPoints = Math.max(...results.filter(n => !isNaN(n)));
        const maxPoints = results.reduce((acc, points) => acc + points, 0);

        const meetsWinningCondition = !poll.majorityWinner || (poll.majorityWinner && mostPoints > maxPoints / 2);
        const hasMinimumPoints = mostPoints > 0 && meetsWinningCondition;

        const winners = results.reduce<number[]>((indices, value, index) => {
            if (hasMinimumPoints && value === mostPoints) indices.push(index);
            return indices;
        }, []);

        return { ...poll, hasUserVoted, results, winners, turnout };
    }

    static isVoteValid(poll: PostPoll, vote: PostVote) {
        const sameLength = vote.selection.length === poll.choices.length;
        const containsOnlyChoiceIndices = vote.selection.every(choice => choice < poll.choices.length && choice >= 0);
        const containsOnlyUniqueItems = vote.selection.length === new Set(vote.selection).size;

        if (poll.method === PollMethod.APPROVAL) {
            return containsOnlyChoiceIndices && containsOnlyUniqueItems;
        }

        if (poll.method === PollMethod.SCORE) {
            const allVotesOnScale = vote.selection.every(
                choice => choice >= SCORE_VOTE_MIN_POINTS && choice <= SCORE_VOTE_MAX_POINTS,
            );
            return sameLength && allVotesOnScale;
        }

        if (poll.method === PollMethod.PLURALITY) {
            const containsExactlyOneChoice = vote.selection.length === 1;
            return containsOnlyChoiceIndices && containsExactlyOneChoice;
        }

        return containsOnlyUniqueItems && containsOnlyChoiceIndices && sameLength;
    }

    async vote(id: string, vote: PostVote, ip: string, cookie?: string) {
        return this.pollRepository.transaction(async tx => {
            const poll = await this.getPoll(id, tx);
            const identifier = poll.voterIdentityMethod === VoterIdentityMethod.COOKIE ? cookie : ip;

            if (!identifier) {
                const logMessage = `Unable to get identifier of type "${poll.voterIdentityMethod}". Value is "${identifier}".`;
                throw new InvalidIpError("Unable to identify user", logMessage);
            }

            const identifierHash = PollService.saltAndHash(identifier);
            await this.pollRepository.advisoryLock(`vote-${id}-${identifierHash}`, tx);
            const hasUserVoted = await this.voteRepository.hasVote(id, identifierHash, tx);

            if (hasUserVoted) {
                const logMessage = `Cannot create vote. Vote for user ${identifierHash} (${poll.voterIdentityMethod}) already exists on poll with id ${id}.`;
                throw new DuplicateKeyError("User has already voted.", logMessage);
            }

            const isVoteValid = PollService.isVoteValid(poll, vote);

            if (!isVoteValid) {
                const logMessage = `Cannot create vote. Vote is invalid. Method: ${poll.method}. Vote: ${vote.selection}`;
                throw new InvalidVoteError("Array of selected choices is invalid.", logMessage);
            }

            return this.voteRepository.create(id, identifierHash, vote, tx);
        });
    }
}
