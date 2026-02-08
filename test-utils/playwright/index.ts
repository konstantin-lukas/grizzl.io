import { type DBFixtures, dbFixture } from "@@/test-utils/database/fixture";
import { expect as baseExpect, test as baseTest } from "@nuxt/test-utils/playwright";
import toBeAccessible from "~~/test-utils/playwright/expect/toBeAccessible";
import toBeDisattached from "~~/test-utils/playwright/expect/toBeDisattached";
import toHaveCountGreaterThan from "~~/test-utils/playwright/expect/toHaveCountGreaterThan";
import HomePage from "~~/test-utils/playwright/pages/home.page";
import TimerPage from "~~/test-utils/playwright/pages/timer.page";
import globalBeforeAfterEach from "~~/test-utils/playwright/test/globalBeforeAfterEach.fixture";
import constructPageObject from "~~/test-utils/playwright/test/page.fixture";

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
    toBeAccessible,
});
