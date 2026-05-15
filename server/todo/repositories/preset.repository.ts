import { transitiveOwnership } from "#server/core/utils/sql.util";
import type { Database } from "~~/database";
import * as dbSchema from "~~/database/schema";
import BaseRepository from "~~/server/core/repositories/base.repository";

const schema = "todoPreset";

export default class PresetRepository extends BaseRepository<typeof schema> {
    constructor(db: Database) {
        super(db, schema, userId => transitiveOwnership(userId, db, dbSchema.todoList, this.schema.listId));
    }
}
