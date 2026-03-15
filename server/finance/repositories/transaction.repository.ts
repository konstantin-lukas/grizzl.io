import type { GetTransactionFilters } from "#shared/finance/validators/transaction.validator";
import { and, desc, eq, gte, ilike, isNull, lte } from "drizzle-orm";
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

    public async findByUserAndAccountId(
        userId: string,
        accountId: string,
        { from, to, reference, category }: GetTransactionFilters = {},
    ) {
        const filters = and(
            to ? lte(this.schema.createdAt, to) : undefined,
            from ? gte(this.schema.createdAt, from) : undefined,
            reference
                ? ilike(this.schema.reference, `%${reference.replaceAll("%", "\\%").replaceAll("_", "\\_")}%`)
                : undefined,
            category ? eq(this.schema.category, category) : undefined,
        );

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
                    filters,
                ),
            )
            .orderBy(desc(this.schema.createdAt));
    }
}
