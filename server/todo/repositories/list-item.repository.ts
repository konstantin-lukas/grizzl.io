import { transitiveOwnership } from "#server/core/utils/sql.util";
import type {
    ChangeAction,
    CreateAction,
    DeleteAction,
    ScheduleAction,
} from "#shared/todo/validators/action.validator";
import { TODO_LIST_MAX_LENGTH } from "#shared/todo/validators/list.validator";
import { type SQL, and, eq, gte, isNotNull, lte, sql } from "drizzle-orm";
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

    private async updateIndices(
        listId: string,
        { min, max = TODO_LIST_MAX_LENGTH }: { min: number; max?: number },
        values: { index: SQL<unknown> },
        ctx: ExecutionContext = this.db,
    ) {
        const condition = and(
            eq(this.schema.listId, listId),
            isNotNull(this.schema.index),
            gte(this.schema.index, min),
            lte(this.schema.index, max),
        );
        await ctx.update(this.schema).set(values).where(condition);
    }

    async incrementIndices(
        listId: string,
        { min, max = TODO_LIST_MAX_LENGTH }: { min: number; max?: number },
        ctx: ExecutionContext = this.db,
    ) {
        await this.updateIndices(listId, { min, max }, { index: sql`${this.schema.index} + 1` }, ctx);
    }

    async decrementIndices(
        listId: string,
        { min, max = TODO_LIST_MAX_LENGTH }: { min: number; max?: number },
        ctx: ExecutionContext = this.db,
    ) {
        await this.updateIndices(listId, { min, max }, { index: sql`${this.schema.index} - 1` }, ctx);
    }

    async updateText({ listId, id, value }: ChangeAction, ctx: ExecutionContext = this.db) {
        const values = { text: value };
        const condition = and(eq(this.schema.listId, listId), eq(this.schema.id, id));
        await ctx.update(this.schema).set(values).where(condition);
    }

    async updateScheduledFor({ listId, id, value }: ScheduleAction, ctx: ExecutionContext = this.db) {
        const values = { scheduledFor: value };
        const condition = and(eq(this.schema.listId, listId), eq(this.schema.id, id));
        await ctx.update(this.schema).set(values).where(condition);
    }

    async updateIndex(
        { listId, id, value }: { listId: string; id: string; value: number | null },
        ctx: ExecutionContext = this.db,
    ) {
        const values = { index: value };
        const condition = and(eq(this.schema.listId, listId), eq(this.schema.id, id));
        await ctx.update(this.schema).set(values).where(condition);
    }

    async deleteByList({ id, listId }: DeleteAction, ctx: ExecutionContext = this.db) {
        const condition = and(eq(this.schema.listId, listId), eq(this.schema.id, id));
        await ctx.delete(this.schema).where(condition);
    }
}
