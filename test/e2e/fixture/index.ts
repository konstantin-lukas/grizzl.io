import { expect as baseExpect, test as baseTest } from "@playwright/test";

import toBeDisattached from "@e2e/fixture/expect/toBeDisattached";
import toHaveCountGreaterThan from "@e2e/fixture/expect/toHaveCountGreaterThan";
import constructPageObject from "@e2e/fixture/test/page.fixture";
import HomePage from "@e2e/page/home.page";

export const test = baseTest.extend<{
    homePage: HomePage;
}>({
    homePage: constructPageObject(HomePage),
});
export const expect = baseExpect.extend({
    toHaveCountGreaterThan,
    toBeDisattached,
});
