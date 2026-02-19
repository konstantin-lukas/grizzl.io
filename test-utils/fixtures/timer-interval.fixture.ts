import { Beat } from "#shared/features/timer/enums/beat.enum";
import BaseFixture, { type InsertOverrides } from "@@/test-utils/fixtures/base.fixture";
import { str } from "@@/test-utils/helpers/data";
import type { drizzle } from "drizzle-orm/node-postgres";

export default class TimerIntervalFixture extends BaseFixture<"timerInterval"> {
    protected defaults = (index: number) => ({
        index,
        title: str({ length: 100, spaces: false, seed: index }),
        repeatCount: 2,
        duration: 3000,
        beatPattern: index % 2 === 0 ? [Beat.NORMAL, Beat.NORMAL, Beat.NORMAL] : null,
    });

    constructor(db: ReturnType<typeof drizzle>) {
        super(db, "timerInterval");
    }

    override async insert<N extends number>(
        count: N,
        overrides: InsertOverrides<"timerInterval"> &
            ({ timerId: string } | ((index: number) => InsertOverrides<"timerInterval">)),
    ) {
        return super.insert(count, overrides);
    }
}
