import { transitiveOwnership } from "#server/core/utils/sql.util";
import { and, eq } from "drizzle-orm";
import type { Database } from "~~/database";
import * as dbSchema from "~~/database/schema";
import BaseRepository, { ExecutionContext } from "~~/server/core/repositories/base.repository";

const schema = "pollVote";

export default class VoteRepository extends BaseRepository<typeof schema> {
    constructor(db: Database) {
        super(db, schema, userId => transitiveOwnership(userId, db, dbSchema.poll, this.schema.pollId));
    }

    public async hasVote(pollId: string, ipHash: string, ctx: ExecutionContext = this.db) {
        const [result] = await ctx
            .select()
            .from(this.schema)
            .where(and(eq(this.schema.ipHash, ipHash), eq(this.schema.pollId, pollId)));

        return !!result;
    }
}
