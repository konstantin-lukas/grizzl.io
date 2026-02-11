import { Beat } from "@@/shared/enum/timer";
import BaseFixture, { type InsertOptions } from "@@/test-utils/fixtures/base.fixture";
import { str } from "@@/test-utils/helpers/data";
import type { drizzle } from "drizzle-orm/node-postgres";

export default class TimerIntervalFixture extends BaseFixture<"timerInterval"> {
    protected dataProvider = (index: number) => ({
        index,
        title: str({ length: 100, spaces: false, seed: index }),
        repeatCount: 2,
        duration: 3000,
        beatPattern: index % 2 === 0 ? [Beat.NORMAL, Beat.NORMAL, Beat.NORMAL] : null,
    });

    constructor(db: ReturnType<typeof drizzle>) {
        super(db, "timerInterval");
    }

    override async insert<N extends number = 2>(
        options: InsertOptions<"timerInterval", N> & { overrides: { timerId: string } },
    ) {
        const { count = 2 as N, overrides = {} } = options;
        return super.insert({ count, overrides });
    }

    async select() {
        return this.db.select().from(this.schema);
    }
}
