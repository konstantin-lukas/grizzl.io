import { expect as baseExpect, test as baseTest } from "@playwright/test";

import toHaveCountGreaterThan from "@e2e/fixture/expect/toHaveCountGreaterThan";

export const test = baseTest.extend({});
export const expect = baseExpect.extend({
    toHaveCountGreaterThan,
});
