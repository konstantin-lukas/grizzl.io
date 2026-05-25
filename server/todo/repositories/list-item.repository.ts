import { transitiveOwnership } from "#server/core/utils/sql.util";
import type { CreateAction } from "#shared/todo/validators/action.validator";
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
}
