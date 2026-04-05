import type {
    BaseTransactionFilters,
    GetTransactionFilters,
    PostTransactionInternal,
    PutTransactionInternal,
} from "#shared/finance/validators/transaction.validator";
import { and, desc, eq, exists, gte, ilike, isNull, lte, sum } from "drizzle-orm";
import type { drizzle } from "drizzle-orm/node-postgres";
import * as dbSchema from "~~/database/schema";
import type { ExecutionContext } from "~~/server/core/repositories/base.repository";
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
                            isNull(dbSchema.financeAccount.deletedAt),
                        ),
                    ),
            );
        });
    }

    public async create(
        accountId: string,
        { amount, reference, categoryId }: PostTransactionInternal,
        ctx: ExecutionContext = this.db,
    ) {
        const [transaction] = await ctx
            .insert(this.schema)
            .values({ accountId, amount, reference, categoryId })
            .returning({ id: this.schema.id });

        return transaction!.id;
    }

    public async update(
        id: string,
        userId: string,
        { amount, reference, categoryId }: PutTransactionInternal,
        ctx: ExecutionContext = this.db,
    ) {
        const { rowCount } = await ctx
            .update(this.schema)
            .set({ amount, reference, categoryId })
            .from(dbSchema.financeAccount)
            .where(
                and(
                    eq(this.schema.id, id),
                    this.ownershipResolver(userId),
                    isNull(this.schema.deletedAt),
                    isNull(dbSchema.financeAccount.deletedAt),
                ),
            );

        return rowCount;
    }

    public async getAmountByIdAndUserAndAccount(
        id: string,
        userId: string,
        accountId: string,
        ctx: ExecutionContext = this.db,
    ) {
        const result = await ctx
            .select({ amount: this.schema.amount })
            .from(this.schema)
            .innerJoin(dbSchema.financeAccount, eq(this.schema.accountId, dbSchema.financeAccount.id))
            .where(
                and(
                    eq(this.schema.id, id),
                    eq(this.schema.accountId, accountId),
                    eq(dbSchema.financeAccount.userId, userId),
                    isNull(this.schema.deletedAt),
                    isNull(dbSchema.financeAccount.deletedAt),
                ),
            );

        return result[0]?.amount;
    }

    public async findByUserAndAccountId(
        userId: string,
        accountId: string,
        { from, to, reference, categoryId }: GetTransactionFilters = {},
    ) {
        const filters = and(
            to && lte(this.schema.createdAt, to),
            from && gte(this.schema.createdAt, from),
            reference
                ? ilike(this.schema.reference, `%${reference.replaceAll("%", "\\%").replaceAll("_", "\\_")}%`)
                : undefined,
            categoryId ? eq(this.schema.categoryId, categoryId) : undefined,
        );

        return this.db
            .select({
                id: this.schema.id,
                createdAt: this.schema.createdAt,
                amount: this.schema.amount,
                reference: this.schema.reference,
                category: {
                    id: dbSchema.financeCategory.id,
                    name: dbSchema.financeCategory.displayName,
                    icon: dbSchema.financeCategory.icon,
                },
            })
            .from(this.schema)
            .innerJoin(dbSchema.financeAccount, eq(this.schema.accountId, dbSchema.financeAccount.id))
            .innerJoin(dbSchema.financeCategory, eq(this.schema.categoryId, dbSchema.financeCategory.id))
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

    public async getAccountBalanceUntil(
        userId: string,
        accountId: string,
        { to, reference, categoryId }: BaseTransactionFilters,
    ) {
        const filters = and(
            lte(this.schema.createdAt, to),
            reference
                ? ilike(this.schema.reference, `%${reference.replaceAll("%", "\\%").replaceAll("_", "\\_")}%`)
                : undefined,
            categoryId ? eq(this.schema.categoryId, categoryId) : undefined,
        );

        const [result] = await this.db
            .select({ sum: sum(this.schema.amount).mapWith(Number) })
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
            );

        return result?.sum ?? 0;
    }
}
