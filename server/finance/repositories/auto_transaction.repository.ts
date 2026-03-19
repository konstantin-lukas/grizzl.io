import type { PostAutoTransaction } from "#shared/finance/validators/auto_transaction.validator";
import { and, desc, eq, exists, isNull } from "drizzle-orm";
import type { drizzle } from "drizzle-orm/node-postgres";
import * as dbSchema from "~~/database/schema";
import BaseRepository from "~~/server/core/repositories/base.repository";

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

    public async create(
        accountId: string,
        { amount, reference, category, execInterval, execOn, lastExec }: PostAutoTransaction,
    ) {
        const [transaction] = await this.db
            .insert(this.schema)
            .values({ accountId, amount, reference, category, execInterval, execOn, lastExec })
            .returning({ id: this.schema.id });

        return transaction!.id;
    }

    public async findByUserAndAccountId(userId: string, accountId: string) {
        return this.db
            .select({
                id: this.schema.id,
                createdAt: this.schema.createdAt,
                amount: this.schema.amount,
                reference: this.schema.reference,
                category: this.schema.category,
                execInterval: this.schema.execInterval,
                execOn: this.schema.execOn,
                lastExec: this.schema.lastExec,
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
