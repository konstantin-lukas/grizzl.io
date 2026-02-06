import type { drizzle } from "drizzle-orm/node-postgres";
import { createDBConnection } from "~~/test-utils/database/connection";
import TimerIntervalFixture from "~~/test-utils/fixtures/timer-interval.fixture";
import TimerFixture from "~~/test-utils/fixtures/timer.fixture";
import UserFixture from "~~/test-utils/fixtures/user.fixture";

export function createDBFixtures(db: ReturnType<typeof drizzle>) {
    return {
        timer: new TimerFixture(db),
        timerInterval: new TimerIntervalFixture(db),
        user: new UserFixture(db),
        client: db,
    };
}

export type DBFixtures = ReturnType<typeof createDBFixtures>;

// eslint-disable-next-line no-empty-pattern
export async function dbFixture({}, waitForUse: (value: DBFixtures) => Promise<void>) {
    const { pool, db } = createDBConnection();

    await waitForUse(createDBFixtures(db));

    await pool.end();
}
