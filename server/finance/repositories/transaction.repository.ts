import type { GetTransactionFilters, PostTransaction } from "#shared/finance/validators/transaction.validator";
import { and, desc, eq, exists, gte, ilike, isNull, lte } from "drizzle-orm";
import type { drizzle } from "drizzle-orm/node-postgres";
import * as dbSchema from "~~/database/schema";
import type { DatabaseTransaction } from "~~/server/core/repositories/base.repository";
import BaseRepository from "~~/server/core/repositories/base.repository";

const schema = "financeTransaction";

export default class TransactionRepository extends BaseRepository<typeof schema> {
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
                        ),
                    ),
            );
        });
    }

    public async create(accountId: string, { amount, reference, category }: PostTransaction, tx?: DatabaseTransaction) {
        const executor = tx ?? this.db;
        const [transaction] = await executor
            .insert(this.schema)
            .values({ accountId, amount, reference, category })
            .returning({ id: this.schema.id });

        return transaction!.id;
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
