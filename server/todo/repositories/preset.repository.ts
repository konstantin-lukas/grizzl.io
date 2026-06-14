import { transitiveOwnership } from "#server/core/utils/sql.util";
import type { PostPreset, PutPreset } from "#shared/todo/validators/preset.validator";
import { and, asc, eq, isNull } from "drizzle-orm";
import type { Database } from "~~/database";
import * as dbSchema from "~~/database/schema";
import BaseRepository, { type ExecutionContext } from "~~/server/core/repositories/base.repository";

const schema = "todoPreset";

export default class PresetRepository extends BaseRepository<typeof schema> {
    constructor(db: Database) {
        super(db, schema, userId => transitiveOwnership(userId, db, dbSchema.todoList, this.schema.listId));
    }

    async findByUserAndListId(userId: string, listId: string, db: ExecutionContext = this.db) {
        return db
            .select({
                id: this.schema.id,
                title: this.schema.title,
                items: this.schema.items,
            })
            .from(this.schema)
            .innerJoin(dbSchema.todoList, eq(this.schema.listId, dbSchema.todoList.id))
            .where(
                and(
                    eq(this.schema.listId, listId),
                    eq(dbSchema.todoList.userId, userId),
                    isNull(dbSchema.todoList.deletedAt),
                    isNull(this.schema.deletedAt),
                ),
            )
            .orderBy(asc(this.schema.title));
    }

    async findByIdUserIdAndListId(id: string, userId: string, listId: string, ctx: ExecutionContext = this.db) {
        const result = await ctx
            .select({
                id: this.schema.id,
                title: this.schema.title,
                items: this.schema.items,
            })
            .from(this.schema)
            .innerJoin(dbSchema.todoList, eq(this.schema.listId, dbSchema.todoList.id))
            .where(
                and(
                    eq(this.schema.id, id),
                    eq(this.schema.listId, listId),
                    eq(dbSchema.todoList.userId, userId),
                    isNull(dbSchema.todoList.deletedAt),
                    isNull(this.schema.deletedAt),
                ),
            )
            .orderBy(asc(this.schema.title));
        return result[0];
    }

    async create(listId: string, { items, title }: PostPreset, ctx: ExecutionContext = this.db) {
        const [{ id }] = (await ctx
            .insert(this.schema)
            .values({ listId, title, items })
            .returning({ id: this.schema.id })) as [{ id: string }];

        return id;
    }

    public async update(id: string, listId: string, userId: string, { title, items }: PutPreset) {
        const { rowCount } = await this.db
            .update(this.schema)
            .set({ title, items })
            .where(
                and(
                    this.ownershipResolver(userId),
                    eq(this.schema.id, id),
                    eq(this.schema.listId, listId),
                    isNull(this.schema.deletedAt),
                ),
            );

        return rowCount;
    }
}
