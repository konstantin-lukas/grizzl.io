import type { Page } from "@playwright/test";
import { expect as baseExpect, test as baseTest } from "@playwright/test";
import type { ReturnType } from "@sinclair/typebox";

import toBeDisattached from "@e2e/fixture/expect/toBeDisattached";
import toHaveCountGreaterThan from "@e2e/fixture/expect/toHaveCountGreaterThan";
import constructPageObject from "@e2e/fixture/test/page.fixture";
import HomePage from "@e2e/page/home.page";
import { goto } from "@e2e/util/test";

type GoTo = (url: Parameters<typeof goto>[1], options?: Parameters<typeof goto>[2]) => ReturnType<typeof goto>;

export const test = baseTest.extend<{
    homePage: HomePage;
    goto: GoTo;
}>({
    homePage: constructPageObject(HomePage),
    goto: async ({ page }: { page: Page }, waitForUse: (value: GoTo) => Promise<void>) => {
        await waitForUse((url, options) => goto(page, url, options));
    },
});

export const expect = baseExpect.extend({
    toHaveCountGreaterThan,
    toBeDisattached,
});
