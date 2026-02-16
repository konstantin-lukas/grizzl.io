import { and, eq, isNotNull, lt } from "drizzle-orm";
import type { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "~~/server/database/schema";

type Schema = "timer";

export default class BaseRepository<T extends Schema> {
    protected readonly db;
    protected readonly schema;
    protected readonly isSoftDeletable;
    public readonly tableName;

    static readonly deps = [];

    constructor(db: ReturnType<typeof drizzle>, tableName: T) {
        this.db = db;
        this.tableName = tableName;
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

    /**
     * Permanently deletes all entities that were marked as soft deleted at least one week ago.
     * @param options.maxAge The maximum amount of milliseconds a record may be marked as soft-deleted before it is hard-deleted.
     * @returns undefined if entity is not soft deletable, null if operation was not successful and number of changed
     * rows otherwise.
     */
    public async purge(options: { maxAge: number }) {
        const { maxAge } = options;
        const refDate = new Date(new Date().getTime() - maxAge);

        if (!this.isSoftDeletable) {
            console.error(`Attempting to purge table that is not soft-deletable: ${this.tableName}.`);
            return;
        }

        const { rowCount } = await this.db
            .delete(this.schema)
            .where(and(isNotNull(this.schema.deletedAt), lt(this.schema.deletedAt, refDate)));
        return rowCount;
    }
}
