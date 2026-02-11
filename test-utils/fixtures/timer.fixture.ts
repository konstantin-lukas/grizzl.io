import BaseFixture from "@@/test-utils/fixtures/base.fixture";
import { eq } from "drizzle-orm";
import type { drizzle } from "drizzle-orm/node-postgres";
import { date, str } from "~~/test-utils/helpers/data";

export default class TimerFixture extends BaseFixture<"timer"> {
    protected dataProvider = (index: number) => ({
        title: str({ length: 100, seed: index, spaces: false }),
        createdAt: date({ seed: index }),
    });

    constructor(db: ReturnType<typeof drizzle>) {
        super(db, "timer");
    }

    async select(id?: string) {
        if (id) return this.db.select().from(this.schema).where(eq(this.schema.id, id));
        return this.db.select().from(this.schema);
    }
}
