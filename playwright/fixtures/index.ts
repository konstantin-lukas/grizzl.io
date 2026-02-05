import db, { type DBFixtures } from "@@/playwright/fixtures/db";
import toBeDisattached from "@@/playwright/fixtures/expect/toBeDisattached";
import toHaveCountGreaterThan from "@@/playwright/fixtures/expect/toHaveCountGreaterThan";
import globalBeforeAfterEach from "@@/playwright/fixtures/test/globalBeforeAfterEach.fixture";
import constructPageObject from "@@/playwright/fixtures/test/page.fixture";
import HomePage from "@@/playwright/pages/home.page";
import TimerPage from "@@/playwright/pages/timer.page";
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
