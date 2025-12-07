import TimerIntervalFixture from "@e2e/fixtures/db/timer-interval.fixture";
import TimerFixture from "@e2e/fixtures/db/timer.fixture";
import UserFixture from "@e2e/fixtures/db/user.fixture";
import * as schema from "@schema";
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";

const { Pool } = pkg;

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
        host: "localhost",
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
}

export default fixture;
