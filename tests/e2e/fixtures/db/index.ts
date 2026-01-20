import * as schema from "@@/lib/db/schema";
import TimerIntervalFixture from "@@/tests/e2e/fixtures/db/timer-interval.fixture";
import TimerFixture from "@@/tests/e2e/fixtures/db/timer.fixture";
import UserFixture from "@@/tests/e2e/fixtures/db/user.fixture";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

function createDBFixtures(db: ReturnType<typeof drizzle>) {
    return {
        timer: new TimerFixture(db),
        timerInterval: new TimerIntervalFixture(db),
        user: new UserFixture(db),
    };
}

export type DBFixtures = ReturnType<typeof createDBFixtures>;

export const pool = new Pool({
    host: "localhost",
    database: "grizzl",
    user: "admin",
    password: "admin",
    ssl: false,
});

// eslint-disable-next-line no-empty-pattern
async function fixture({}, waitForUse: (value: DBFixtures) => Promise<void>) {
    const db = drizzle(pool, {
        casing: "snake_case",
        schema,
    });

    await waitForUse(createDBFixtures(db));
}

export default fixture;
