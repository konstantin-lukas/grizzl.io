import BaseFixture from "@@/tests/e2e/fixtures/db/base.fixture";
import { date, dateArr, str } from "@@/tests/utils/helpers";
import { eq } from "drizzle-orm";
import type { drizzle } from "drizzle-orm/node-postgres";

export default class TimerFixture extends BaseFixture<"timer"> {
    constructor(db: ReturnType<typeof drizzle>) {
        super(db, "timer");
    }

    async insert(options: { deleted?: boolean; userId?: string; count?: number } = {}) {
        const count = options.count ?? 5;
        const userId = (await this.testUser)!.id;
        const dates = dateArr({ length: count });
        const data = Array.from({ length: count }).map((_, index) => ({
            title: str({ length: 100, seed: index, spaces: false }),
            createdAt: dates[index],
            deletedAt: options.deleted ? date() : null,
            userId: options.userId ?? userId,
        }));
        return this.db.insert(this.schema).values(data).returning();
    }

    async select(id?: string) {
        if (id) return this.db.select().from(this.schema).where(eq(this.schema.id, id));
        return this.db.select().from(this.schema);
    }
}
