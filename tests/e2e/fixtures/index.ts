import toBeDisattached from "@e2e/fixtures/expect/toBeDisattached";
import toHaveCountGreaterThan from "@e2e/fixtures/expect/toHaveCountGreaterThan";
import constructPageObject from "@e2e/fixtures/test/page.fixture";
import HomePage from "@e2e/pages/home.page";
import { expect as baseExpect, test as baseTest } from "@nuxt/test-utils/playwright";

export const test = baseTest.extend<{
    homePage: HomePage;
}>({
    homePage: constructPageObject(HomePage),
});

export const expect = baseExpect.extend({
    toHaveCountGreaterThan,
    toBeDisattached,
});
