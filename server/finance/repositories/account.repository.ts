import type { PostAccount, PutAccount } from "#shared/finance/validators/account.validator";
import { and, desc, eq, isNull } from "drizzle-orm";
import type { drizzle } from "drizzle-orm/node-postgres";
import BaseRepository, { type DatabaseTransaction } from "~~/server/core/repositories/base.repository";

const schema = "financeAccount";

export default class AccountRepository extends BaseRepository<typeof schema> {
    constructor(db: ReturnType<typeof drizzle>) {
        super(db, schema, userId => eq(this.schema.userId, userId));
    }

    public async findByUserId(userId: string, tx?: DatabaseTransaction) {
        const executor = tx ?? this.db;
        return executor
            .select({
                id: this.schema.id,
                title: this.schema.title,
                createdAt: this.schema.createdAt,
                currency: this.schema.currency,
                balance: this.schema.balance,
            })
            .from(this.schema)
            .where(and(eq(this.schema.userId, userId), isNull(this.schema.deletedAt)))
            .orderBy(desc(this.schema.createdAt));
    }

    public async create(userId: string, { title, currency }: PostAccount) {
        const [account] = await this.db
            .insert(this.schema)
            .values({
                title,
                currency,
                userId,
            })
            .returning({ id: this.schema.id });

        return account!.id;
    }

    public async update(id: string, userId: string, { title }: PutAccount) {
        const { rowCount } = await this.db
            .update(this.schema)
            .set({ title })
            .where(and(eq(this.schema.id, id), eq(this.schema.userId, userId)));

        return rowCount;
    }

    public async updateBalance(id: string, balance: number, tx?: DatabaseTransaction) {
        const executor = tx ?? this.db;
        const { rowCount } = await executor.update(this.schema).set({ balance }).where(eq(this.schema.id, id));
        return rowCount;
    }
}
