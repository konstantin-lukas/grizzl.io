import db, { type DBFixtures } from "@e2e/fixtures/db";
import toBeDisattached from "@e2e/fixtures/expect/toBeDisattached";
import toHaveCountGreaterThan from "@e2e/fixtures/expect/toHaveCountGreaterThan";
import globalBeforeAfterEach from "@e2e/fixtures/test/globalBeforeAfterEach.fixture";
import constructPageObject from "@e2e/fixtures/test/page.fixture";
import HomePage from "@e2e/pages/home.page";
import TimerPage from "@e2e/pages/timer.page";
import { expect as baseExpect, test as baseTest } from "@nuxt/test-utils/playwright";

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
    db: [db, { scope: "worker" }],
});

export const expect = baseExpect.extend({
    toHaveCountGreaterThan,
    toBeDisattached,
});
