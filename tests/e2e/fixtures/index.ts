import db, { type DBFixtures } from "@e2e/fixtures/db";
import toBeDisattached from "@e2e/fixtures/expect/toBeDisattached";
import toHaveCountGreaterThan from "@e2e/fixtures/expect/toHaveCountGreaterThan";
import constructPageObject from "@e2e/fixtures/test/page.fixture";
import HomePage from "@e2e/pages/home.page";
import { expect as baseExpect, test as baseTest } from "@nuxt/test-utils/playwright";

export const test = baseTest.extend<
    {
        homePage: HomePage;
    },
    { db: DBFixtures }
>({
    homePage: constructPageObject(HomePage),
    db: [db, { scope: "worker" }],
});

export const expect = baseExpect.extend({
    toHaveCountGreaterThan,
    toBeDisattached,
});
