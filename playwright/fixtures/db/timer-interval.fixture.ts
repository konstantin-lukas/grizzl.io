import BaseFixture from "@@/playwright/fixtures/db/base.fixture";
import { Beat } from "@@/shared/enum/timer";
import { str } from "@@/tests/utils/helpers";
import type { InferInsertModel } from "drizzle-orm";
import type { drizzle } from "drizzle-orm/node-postgres";
import type { timerInterval } from "~~/server/database/schema";
import { defaultIfUndefined } from "~~/tests/utils/logic";

type InsertOptions = Partial<Omit<InferInsertModel<typeof timerInterval>, "timerId">> & { count?: number };

export default class TimerIntervalFixture extends BaseFixture<"timerInterval"> {
    constructor(db: ReturnType<typeof drizzle>) {
        super(db, "timerInterval");
    }

    async insert(timerId: string, options: InsertOptions = {}) {
        const { count = 2, repeatCount = 2, duration = 3000, beatPattern, index, title } = options;
        const getBeatPattern = (index: number) => (index % 2 === 0 ? [Beat.NORMAL, Beat.NORMAL, Beat.NORMAL] : null);
        const data = Array.from({ length: count }).map((_, i) => ({
            timerId,
            title: defaultIfUndefined(title, () => str({ length: 100, spaces: false, seed: i })),
            index: index ?? i,
            repeatCount,
            duration,
            beatPattern: defaultIfUndefined(beatPattern, () => getBeatPattern(i)),
        }));
        return this.db.insert(this.schema).values(data).returning();
    }

    async select() {
        return this.db.select().from(this.schema);
    }
}
