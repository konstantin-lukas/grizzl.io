import { type DBFixtures, dbFixture } from "@@/test-utils/database/fixture";
import { expect as baseExpect, test as baseTest } from "@nuxt/test-utils/playwright";
import toBeDisattached from "~~/test-utils/playwright/expect/toBeDisattached";
import toHaveCountGreaterThan from "~~/test-utils/playwright/expect/toHaveCountGreaterThan";
import HomePage from "~~/test-utils/playwright/pages/home.page";
import TimerPage from "~~/test-utils/playwright/pages/timer.page";
import globalBeforeAfterEach from "~~/test-utils/playwright/test/globalBeforeAfterEach.fixture";
import constructPageObject from "~~/test-utils/playwright/test/page.fixture";

export const seed = baseTest.extend<object, { db: DBFixtures }>({
    db: [dbFixture, { scope: "worker" }],
});

export const test = seed.extend<{
    globalBeforeAfterEach: unknown;
    homePage: HomePage;
    timerPage: TimerPage;
}>({
    homePage: constructPageObject(HomePage),
    timerPage: constructPageObject(TimerPage),
    globalBeforeAfterEach: [globalBeforeAfterEach(), { auto: true }],
});

export const expect = baseExpect.extend({
    toHaveCountGreaterThan,
    toBeDisattached,
});
