import BaseFixture from "@e2e/fixtures/db/base.fixture";
import { faker } from "@faker-js/faker";
import { eq } from "drizzle-orm";
import type { drizzle } from "drizzle-orm/node-postgres";

export default class TimerFixture extends BaseFixture<"timer"> {
    constructor(db: ReturnType<typeof drizzle>) {
        super(db, "timer");
    }

    async insert(options: { deleted?: boolean; userId?: string; count?: number } = {}) {
        const count = options.count ?? 5;
        const userId = (await this.testUser).id;
        const dates = faker.helpers.uniqueArray(faker.date.past, count);
        const data = Array.from({ length: count }).map((_, index) => ({
            title: faker.string.alphanumeric({ length: 100 }),
            createdAt: dates[index],
            deleted: !!options.deleted,
            userId: options.userId ?? userId,
        }));
        return this.db.insert(this.schema).values(data).returning();
    }

    async select(id?: string) {
        if (id) return this.db.select().from(this.schema).where(eq(this.schema.id, id));
        return this.db.select().from(this.schema);
    }
}
