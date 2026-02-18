import BaseFixture from "@@/test-utils/fixtures/base.fixture";
import type { drizzle } from "drizzle-orm/node-postgres";
import { date, str } from "~~/test-utils/helpers/data";

export default class TimerFixture extends BaseFixture<"timer"> {
    protected defaults = (index: number) => ({
        title: str({ length: 100, seed: index, spaces: false }),
        createdAt: date({ seed: index }),
    });

    constructor(db: ReturnType<typeof drizzle>) {
        super(db, "timer");
    }
}
