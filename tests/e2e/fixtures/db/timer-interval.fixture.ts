import { Beat } from "@@/shared/enum/timer";
import { str } from "@@/tests/utils/helpers";
import BaseFixture from "@e2e/fixtures/db/base.fixture";
import type { drizzle } from "drizzle-orm/node-postgres";

export default class TimerIntervalFixture extends BaseFixture<"timerInterval"> {
    constructor(db: ReturnType<typeof drizzle>) {
        super(db, "timerInterval");
    }

    async insert(
        timerId: string,
        options: { count?: number; repeatCount?: number; duration?: number; beatPattern?: Beat[] | null } = {},
    ) {
        const { count = 2, repeatCount = 2, duration = 3000, beatPattern } = options;
        const getBeatPattern = (index: number) => (index % 2 === 0 ? [Beat.NORMAL, Beat.NORMAL, Beat.NORMAL] : null);
        const data = Array.from({ length: count }).map((_, index) => ({
            timerId,
            title: str(100, { base: index.toString() }),
            index,
            repeatCount,
            duration,
            beatPattern: beatPattern === undefined ? getBeatPattern(index) : beatPattern,
        }));
        return this.db.insert(this.schema).values(data).returning();
    }

    async select() {
        return this.db.select().from(this.schema);
    }
}
