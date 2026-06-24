import { eq } from "drizzle-orm";
import type { Database } from "~~/database";
import type { ExecutionContext } from "~~/server/core/repositories/base.repository";
import BaseRepository from "~~/server/core/repositories/base.repository";

const schema = "poll";

export default class PollRepository extends BaseRepository<typeof schema> {
    constructor(db: Database) {
        super(db, schema, userId => eq(this.schema.userId, userId));
    }

    public async findByUserId(userId: string, ctx: ExecutionContext = this.db) {
        const result = await ctx.query.poll.findMany({
            where: (poll, { eq, isNull, and }) => and(eq(poll.userId, userId), isNull(poll.deletedAt)),
            with: {
                votes: {
                    columns: {
                        selection: true,
                    },
                },
            },
            orderBy: (poll, { desc, asc }) => [desc(poll.createdAt), asc(poll.title)],
            columns: {
                id: true,
                title: true,
                createdAt: true,
                closesAt: true,
                choices: true,
                method: true,
                majorityWinner: true,
            },
        });

        return result.map(poll => ({ ...poll, votes: poll.votes.map(vote => vote.selection) }));
    }

    public async findById(id: string, ctx: ExecutionContext = this.db) {
        const result = await ctx.query.poll.findMany({
            where: (poll, { eq, isNull, and }) => and(eq(poll.id, id), isNull(poll.deletedAt)),
            with: {
                votes: {
                    columns: {
                        selection: true,
                    },
                },
            },
            orderBy: (poll, { desc, asc }) => [desc(poll.createdAt), asc(poll.title)],
            columns: {
                id: true,
                title: true,
                createdAt: true,
                closesAt: true,
                choices: true,
                method: true,
                majorityWinner: true,
            },
        });

        const poll = result[0];
        return poll && { ...poll, votes: poll.votes.map(vote => vote.selection) };
    }
}
