import BaseFixture from "@@/playwright/fixtures/db/base.fixture";
import { date, str } from "@@/tests/utils/helpers";
import { type InferInsertModel, eq } from "drizzle-orm";
import type { drizzle } from "drizzle-orm/node-postgres";
import type { timer } from "~~/server/database/schema";
import { defaultIfUndefined } from "~~/tests/utils/logic";

type InsertOptions = Partial<Omit<InferInsertModel<typeof timer>, "deletedAt">> & { count?: number; deleted?: boolean };

export default class TimerFixture extends BaseFixture<"timer"> {
    constructor(db: ReturnType<typeof drizzle>) {
        super(db, "timer");
    }

    async insert(options: InsertOptions = {}) {
        const { count = 5, title, createdAt, deleted, userId = (await this.testUser)!.id } = options;
        const data = Array.from({ length: count }).map((_, index) => ({
            title: defaultIfUndefined(title, () => str({ length: 100, seed: index, spaces: false })),
            createdAt: defaultIfUndefined(createdAt, () => date({ seed: index })),
            deletedAt: deleted ? date({ seed: index + count }) : null,
            userId,
        }));
        return this.db.insert(this.schema).values(data).returning();
    }

    async select(id?: string) {
        if (id) return this.db.select().from(this.schema).where(eq(this.schema.id, id));
        return this.db.select().from(this.schema);
    }
}
