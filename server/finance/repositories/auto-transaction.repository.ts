import type {
    PostAutoTransactionInternal,
    PutAutoTransactionInternal,
} from "#shared/finance/validators/auto-transaction.validator";
import { and, desc, eq, exists, isNull } from "drizzle-orm";
import type { drizzle } from "drizzle-orm/node-postgres";
import * as dbSchema from "~~/database/schema";
import BaseRepository, { type ExecutionContext } from "~~/server/core/repositories/base.repository";

const schema = "financeAutoTransaction";

export default class AutoTransactionRepository extends BaseRepository<typeof schema> {
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

    public async update(
        id: string,
        userId: string,
        accountId: string,
        { amount, reference, categoryId, execInterval, execOn, lastExec }: PutAutoTransactionInternal,
        db: ExecutionContext = this.db,
    ) {
        const { rowCount } = await db
            .update(this.schema)
            .set({ amount, reference, categoryId, execInterval, execOn, lastExec })
            .from(dbSchema.financeAccount)
            .where(
                and(
                    eq(this.schema.id, id),
                    eq(dbSchema.financeAccount.userId, userId),
                    eq(this.schema.accountId, accountId),
                    isNull(this.schema.deletedAt),
                    isNull(dbSchema.financeAccount.deletedAt),
                ),
            );

        return rowCount;
    }

    public async create(
        accountId: string,
        { amount, reference, categoryId, execInterval, execOn, lastExec }: PostAutoTransactionInternal,
        db: ExecutionContext = this.db,
    ) {
        const [transaction] = await db
            .insert(this.schema)
            .values({ accountId, amount, reference, categoryId, execInterval, execOn, lastExec })
            .returning({ id: this.schema.id });

        return transaction!.id;
    }

    public async findByUserAndAccountId(userId: string, accountId: string, db: ExecutionContext = this.db) {
        return db
            .select({
                id: this.schema.id,
                createdAt: this.schema.createdAt,
                amount: this.schema.amount,
                reference: this.schema.reference,
                execInterval: this.schema.execInterval,
                execOn: this.schema.execOn,
                lastExec: this.schema.lastExec,
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
                ),
            )
            .orderBy(desc(this.schema.createdAt));
    }
}
