import BaseFixture from "@e2e/fixtures/db/base.fixture";
import { faker } from "@faker-js/faker";
import type { drizzle } from "drizzle-orm/node-postgres";

export default class TimerFixture extends BaseFixture<"timer"> {
    constructor(db: ReturnType<typeof drizzle>) {
        super(db, "timer");
    }

    async insert() {
        const userId = (await this.user).id;
        const count = 5;
        const data = Array.from({ length: count }).map(() => ({
            title: faker.string.alphanumeric({ length: 100 }),
            userId,
            ttsVoice: null,
            ...this.defaultDeleted,
            ...this.defaultCreatedAt,
            ...this.defaultId,
        }));
        await this.db.insert(this.schema).values(data);
        return data;
    }
}
