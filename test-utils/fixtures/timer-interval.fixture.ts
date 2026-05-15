import { Beat } from "#shared/timer/enums/beat.enum";
import BaseFixture, { type ExtendedInsertOverrides } from "@@/test-utils/fixtures/base.fixture";
import { str } from "@@/test-utils/helpers/data";
import type { Database } from "~~/database";

export default class TimerIntervalFixture extends BaseFixture<"timerInterval"> {
    protected defaults = (index: number) => ({
        index,
        title: str({ length: 100, spaces: false, seed: index }),
        repeatCount: 2,
        duration: 3000,
        preparationTime: 0,
        beatPattern: index % 2 === 0 ? [Beat.NORMAL, Beat.NORMAL, Beat.NORMAL] : null,
    });

    constructor(db: Database) {
        super(db, "timerInterval");
    }

    override async insert<N extends number>(
        count: N,
        overrides: ExtendedInsertOverrides<"timerInterval", { timerId: string }>,
    ) {
        return super.insert(count, overrides);
    }
}
