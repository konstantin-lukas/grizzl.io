import BaseFixture from "@@/fixtures/base.fixture";
import type { timer } from "@@/server/database/schema";
import { date, str } from "@@/tests/utils/helpers";
import { coalesceUndefined } from "@@/tests/utils/logic";
import { type InferInsertModel, eq } from "drizzle-orm";
import type { drizzle } from "drizzle-orm/node-postgres";

type InsertOptions<N extends number> = Partial<Omit<InferInsertModel<typeof timer>, "deletedAt">> & {
    count?: N;
    deleted?: boolean;
};

export default class TimerFixture extends BaseFixture<"timer"> {
    constructor(db: ReturnType<typeof drizzle>) {
        super(db, "timer");
    }

    async insert<N extends number = 5>(options: InsertOptions<N> = {}) {
        const { count = 5, title, createdAt, deleted, userId = (await this.testUser)!.id } = options;
        const data = Array.from({ length: count }).map((_, index) => ({
            title: coalesceUndefined(title, () => str({ length: 100, seed: index, spaces: false })),
            createdAt: coalesceUndefined(createdAt, () => date({ seed: index })),
            deletedAt: deleted ? date({ seed: index + count }) : null,
            userId,
        }));
        const returnValue = await this.db.insert(this.schema).values(data).returning();
        return returnValue as NTuple<ArrayElement<typeof returnValue>, N>;
    }

    async select(id?: string) {
        if (id) return this.db.select().from(this.schema).where(eq(this.schema.id, id));
        return this.db.select().from(this.schema);
    }
}
