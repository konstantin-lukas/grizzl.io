import { transitiveOwnership } from "#server/core/utils/sql.util";
import type { PostVote } from "#shared/poll/validators/vote.validator";
import { and, eq } from "drizzle-orm";
import type { Database } from "~~/database";
import * as dbSchema from "~~/database/schema";
import type { ExecutionContext } from "~~/server/core/repositories/base.repository";
import BaseRepository from "~~/server/core/repositories/base.repository";

const schema = "pollVote";

export default class VoteRepository extends BaseRepository<typeof schema> {
    constructor(db: Database) {
        super(db, schema, userId => transitiveOwnership(userId, db, dbSchema.poll, this.schema.pollId));
    }

    public async hasVote(pollId: string, voterIdentifierHash: string, ctx: ExecutionContext = this.db) {
        const [result] = await ctx
            .select()
            .from(this.schema)
            .where(and(eq(this.schema.voterIdentifierHash, voterIdentifierHash), eq(this.schema.pollId, pollId)));

        return !!result;
    }

    public async create(
        pollId: string,
        voterIdentifierHash: string,
        { selection }: PostVote,
        ctx: ExecutionContext = this.db,
    ) {
        await ctx.insert(this.schema).values({ pollId, voterIdentifierHash, selection });
    }
}
