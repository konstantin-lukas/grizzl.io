import { transitiveOwnership } from "#server/core/utils/sql.util";
import type { ChangeAction, CreateAction } from "#shared/todo/validators/action.validator";
import { and, eq, gte, sql } from "drizzle-orm";
import type { Database } from "~~/database";
import * as dbSchema from "~~/database/schema";
import BaseRepository, { type ExecutionContext } from "~~/server/core/repositories/base.repository";

const schema = "todoListItem";

export default class ListItemRepository extends BaseRepository<typeof schema> {
    constructor(db: Database) {
        super(db, schema, userId => transitiveOwnership(userId, db, dbSchema.todoList, this.schema.listId));
    }

    async create({ id, listId, text, index }: CreateAction, ctx: ExecutionContext = this.db) {
        await ctx.insert(this.schema).values({ id, listId, text, index });
    }

    async incrementIndices(listId: string, startingIndex: number, ctx: ExecutionContext = this.db) {
        const condition = and(eq(this.schema.listId, listId), gte(this.schema.index, startingIndex));
        const values = { index: sql`${this.schema.index} + 1` };
        await ctx.update(this.schema).set(values).where(condition);
    }

    async updateText({ listId, id, value }: ChangeAction, ctx: ExecutionContext = this.db) {
        const values = { text: value };
        const condition = and(eq(this.schema.listId, listId), eq(this.schema.id, id));
        await ctx.update(this.schema).set(values).where(condition);
    }
}
