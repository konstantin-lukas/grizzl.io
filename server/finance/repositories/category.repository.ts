import type { CategoryInternal } from "#shared/finance/validators/category.validator";
import { and, desc, eq, exists, isNull } from "drizzle-orm";
import type { drizzle } from "drizzle-orm/node-postgres";
import * as dbSchema from "~~/database/schema";
import BaseRepository, { type ExecutionContext } from "~~/server/core/repositories/base.repository";

const schema = "financeCategory";

export default class CategoryRepository extends BaseRepository<typeof schema> {
    constructor(db: ReturnType<typeof drizzle>) {
        super(db, schema, userId => {
            return exists(
                db
                    .select()
                    .from(dbSchema.financeAccount)
                    .where(
                        and(
                            eq(dbSchema.financeAccount.id, this.schema.accountId),
                            eq(dbSchema.financeAccount.userId, userId),
                            isNull(dbSchema.financeAccount.deletedAt),
                        ),
                    ),
            );
        });
    }

    async findByUserAndAccountId(userId: string, accountId: string, db: ExecutionContext = this.db) {
        return db
            .select({
                id: this.schema.id,
                displayName: this.schema.displayName,
                normalizedName: this.schema.normalizedName,
                icon: this.schema.icon,
            })
            .from(this.schema)
            .innerJoin(dbSchema.financeAccount, eq(this.schema.accountId, dbSchema.financeAccount.id))
            .where(
                and(
                    eq(this.schema.accountId, accountId),
                    eq(dbSchema.financeAccount.userId, userId),
                    isNull(dbSchema.financeAccount.deletedAt),
                ),
            )
            .orderBy(desc(this.schema.displayName));
    }

    async upsert(
        accountId: string,
        { normalizedName, displayName, icon }: CategoryInternal,
        db: ExecutionContext = this.db,
    ) {
        return await db
            .insert(this.schema)
            .values({ normalizedName, displayName, icon, accountId })
            .onConflictDoUpdate({
                target: [this.schema.accountId, this.schema.normalizedName],
                set: {
                    displayName,
                    icon,
                },
            })
            .returning({ id: this.schema.id });
    }
}
