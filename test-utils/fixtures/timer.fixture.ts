import type { timer } from "@@/server/database/schema";
import BaseFixture from "@@/test-utils/fixtures/base.fixture";
import { type InferInsertModel, eq } from "drizzle-orm";
import type { drizzle } from "drizzle-orm/node-postgres";
import { date, str } from "~~/test-utils/helpers/data";
import { coalesceUndefined } from "~~/test-utils/helpers/logic";

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
