import type { PostList, PutList } from "#shared/todo/validators/list.validator";
import { and, count, eq } from "drizzle-orm";
import type { Database } from "~~/database";
import * as dbSchema from "~~/database/schema";
import BaseRepository, { type ExecutionContext } from "~~/server/core/repositories/base.repository";

const schema = "todoList";

export default class ListRepository extends BaseRepository<typeof schema> {
    constructor(db: Database) {
        super(db, schema, userId => eq(this.schema.userId, userId));
    }

    /* c8 ignore start */
    public async hasPreset(presetId: string, userId: string, listId: string, ctx: ExecutionContext = this.db) {
        const [result] = await ctx
            .select({ value: count() })
            .from(dbSchema.todoPreset)
            .innerJoin(this.schema, eq(dbSchema.todoPreset.listId, this.schema.id))
            .where(
                and(eq(dbSchema.todoPreset.id, presetId), eq(this.schema.id, listId), eq(this.schema.userId, userId)),
            )
            .limit(1);

        return !!result?.value;
    }
    /* c8 ignore stop */

    public async findByUserId(userId: string, ctx: ExecutionContext = this.db) {
        return ctx.query.todoList.findMany({
            where: (todoList, { eq, isNull, and }) => and(eq(todoList.userId, userId), isNull(todoList.deletedAt)),
            with: {
                items: {
                    columns: {
                        id: true,
                        text: true,
                        index: true,
                        scheduledFor: true,
                    },
                    orderBy: (item, { asc }) => [asc(item.index)],
                },
            },
            orderBy: (todoList, { desc, asc }) => [desc(todoList.createdAt), asc(todoList.title)],
            columns: {
                id: true,
                title: true,
                icon: true,
                createdAt: true,
            },
        });
    }

    public async getCount(userId: string, ctx: ExecutionContext = this.db) {
        const result = await ctx.select({ count: count() }).from(this.schema).where(eq(this.schema.userId, userId));

        return result[0]?.count;
    }

    async create(userId: string, { icon, title }: PostList, ctx: ExecutionContext = this.db) {
        const [{ listId }] = (await ctx
            .insert(this.schema)
            .values({ userId, icon, title })
            .returning({ listId: this.schema.id })) as [{ listId: string }];

        return listId;
    }

    public async update(id: string, userId: string, { title, icon }: PutList) {
        const { rowCount } = await this.db
            .update(this.schema)
            .set({ title, icon })
            .where(and(eq(this.schema.id, id), eq(this.schema.userId, userId)));

        return rowCount;
    }
}
