import { eq } from "drizzle-orm";
import type { drizzle } from "drizzle-orm/node-postgres";
import BaseRepository from "~~/server/core/repositories/base.repository";

const schema = "todoList";

export default class ListRepository extends BaseRepository<typeof schema> {
    constructor(db: ReturnType<typeof drizzle>) {
        super(db, schema, userId => eq(this.schema.userId, userId));
    }
}
