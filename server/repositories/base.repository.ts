import { and, eq } from "drizzle-orm";
import type { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "~~/server/database/schema";

type Schema = "timer";

export default class BaseRepository<T extends Schema> {
    protected readonly db;
    protected readonly schema;
    protected readonly isSoftDeletable;

    constructor(db: ReturnType<typeof drizzle>, tableName: T) {
        this.db = db;
        this.schema = schema[tableName];
        this.isSoftDeletable = Object.keys(this.schema).includes("deletedAt");
    }

    /**
     * @returns null if operation was not successful and number of changed rows otherwise.
     */
    public async delete(options: { id: string; userId: string }) {
        const { id, userId } = options;
        const isSoftDeletable = Object.keys(this.schema).includes("deletedAt");

        const where = and(eq(this.schema.id, id), eq(this.schema.userId, userId));

        const { rowCount } = isSoftDeletable
            ? await this.db
                  .update(this.schema)
                  .set({ deletedAt: new Date() } as never)
                  .where(where)
            : await this.db.delete(this.schema).where(where);

        return rowCount;
    }

    /**
     * @returns undefined if entity is not soft deletable, null if operation was not successful and number of changed
     * rows otherwise.
     */
    public async undelete(options: { id: string; userId: string }) {
        if (!this.isSoftDeletable) return;

        const { id, userId } = options;

        const { rowCount } = await this.db
            .update(this.schema)
            .set({ deletedAt: null } as never)
            .where(and(eq(this.schema.id, id), eq(this.schema.userId, userId)));

        return rowCount;
    }
}
