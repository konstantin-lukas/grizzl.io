import TimerIntervalFixture from "@@/playwright/fixtures/db/timer-interval.fixture";
import TimerFixture from "@@/playwright/fixtures/db/timer.fixture";
import UserFixture from "@@/playwright/fixtures/db/user.fixture";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "~~/server/database/schema";

function createDBFixtures(db: ReturnType<typeof drizzle>) {
    return {
        timer: new TimerFixture(db),
        timerInterval: new TimerIntervalFixture(db),
        user: new UserFixture(db),
    };
}

export type DBFixtures = ReturnType<typeof createDBFixtures>;

// eslint-disable-next-line no-empty-pattern
async function fixture({}, waitForUse: (value: DBFixtures) => Promise<void>) {
    const pool = new Pool({
        host: "postgres",
        database: "grizzl",
        user: "admin",
        password: "admin",
        ssl: false,
    });

    const db = drizzle(pool, {
        casing: "snake_case",
        schema,
    });

    await waitForUse(createDBFixtures(db));

    await pool.end();
}

export default fixture;
