import type { timerInterval } from "@@/server/database/schema";
import { Beat } from "@@/shared/enum/timer";
import BaseFixture from "@@/test-utils/fixtures/base.fixture";
import { str } from "@@/test-utils/helpers/data";
import { coalesceUndefined } from "@@/test-utils/helpers/logic";
import type { InferInsertModel } from "drizzle-orm";
import type { drizzle } from "drizzle-orm/node-postgres";

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
            title: coalesceUndefined(title, () => str({ length: 100, spaces: false, seed: i })),
            index: index ?? i,
            repeatCount,
            duration,
            beatPattern: coalesceUndefined(beatPattern, () => getBeatPattern(i)),
        }));
        return this.db.insert(this.schema).values(data).returning();
    }

    async select() {
        return this.db.select().from(this.schema);
    }
}
