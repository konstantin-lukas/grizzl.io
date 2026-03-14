import { and, desc, eq, isNull } from "drizzle-orm";
import type { drizzle } from "drizzle-orm/node-postgres";
import * as dbSchema from "~~/database/schema";
import BaseRepository from "~~/server/core/repositories/base.repository";

const schema = "financeTransaction";

export default class TransactionRepository extends BaseRepository<typeof schema> {
    constructor(db: ReturnType<typeof drizzle>) {
        super(db, schema, userId => {
            return and(
                eq(this.schema.accountId, dbSchema.financeAccount.id),
                eq(dbSchema.financeAccount.userId, userId),
            )!;
        });
    }

    public async findByAccountAndUserId(userId: string, accountId: string) {
        return this.db
            .select({
                id: this.schema.id,
                createdAt: this.schema.createdAt,
                amount: this.schema.amount,
                reference: this.schema.reference,
                category: this.schema.category,
            })
            .from(this.schema)
            .innerJoin(dbSchema.financeAccount, eq(this.schema.accountId, dbSchema.financeAccount.id))
            .where(
                and(
                    eq(this.schema.accountId, accountId),
                    eq(dbSchema.financeAccount.userId, userId),
                    isNull(this.schema.deletedAt),
                    isNull(dbSchema.financeAccount.deletedAt),
                ),
            )
            .orderBy(desc(this.schema.createdAt));
    }
}
