import { expect as baseExpect, test as baseTest } from "@nuxt/test-utils/playwright";
import type { drizzle } from "drizzle-orm/node-postgres";
import { createDBConnection } from "~~/test-utils/database/connection";
import TimerIntervalFixture from "~~/test-utils/fixtures/timer-interval.fixture";
import TimerFixture from "~~/test-utils/fixtures/timer.fixture";
import UserFixture from "~~/test-utils/fixtures/user.fixture";
import toBeDisattached from "~~/test-utils/playwright/expect/toBeDisattached";
import toHaveCountGreaterThan from "~~/test-utils/playwright/expect/toHaveCountGreaterThan";
import HomePage from "~~/test-utils/playwright/pages/home.page";
import TimerPage from "~~/test-utils/playwright/pages/timer.page";
import globalBeforeAfterEach from "~~/test-utils/playwright/test/globalBeforeAfterEach.fixture";
import constructPageObject from "~~/test-utils/playwright/test/page.fixture";

function createDBFixtures(db: ReturnType<typeof drizzle>) {
    return {
        timer: new TimerFixture(db),
        timerInterval: new TimerIntervalFixture(db),
        user: new UserFixture(db),
    };
}

export type DBFixtures = ReturnType<typeof createDBFixtures>;

// eslint-disable-next-line no-empty-pattern
async function dbFixture({}, waitForUse: (value: DBFixtures) => Promise<void>) {
    const { pool, db } = createDBConnection();

    await waitForUse(createDBFixtures(db));

    await pool.end();
}

export const test = baseTest.extend<
    {
        homePage: HomePage;
        timerPage: TimerPage;
        globalBeforeAfterEach: unknown;
    },
    { db: DBFixtures }
>({
    homePage: constructPageObject(HomePage),
    timerPage: constructPageObject(TimerPage),
    globalBeforeAfterEach: [globalBeforeAfterEach(), { auto: true }],
    db: [dbFixture, { scope: "worker" }],
});

export const expect = baseExpect.extend({
    toHaveCountGreaterThan,
    toBeDisattached,
});
