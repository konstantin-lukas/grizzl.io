import { transitiveOwnership } from "#server/core/utils/sql.util";
import type { drizzle } from "drizzle-orm/node-postgres";
import * as dbSchema from "~~/database/schema";
import BaseRepository from "~~/server/core/repositories/base.repository";

const schema = "todoListItem";

export default class TodoListItemRepository extends BaseRepository<typeof schema> {
    constructor(db: ReturnType<typeof drizzle>) {
        super(db, schema, userId => transitiveOwnership(userId, db, dbSchema.todoList, this.schema.listId));
    }
}
