import { expect, test } from "~~/test-utils/playwright";
import { SCREENSHOT } from "~~/test-utils/playwright/tags";

test("should register a service worker when supported", async ({ financePage: page }) => {
    await page.goto();
    const ready = await page.swReady();
    expect(ready).not.toBe(null);
});

test("allows creating an account from an empty state", { tag: SCREENSHOT }, async ({ financePage: page }) => {
    await page.goto();
    await page.expect().toBeValid({ name: "no-existing-account" });
    await page.click("accountMenu");
    await page.expect("accountMenuOption").toBeDisattached();
    await page.click("accountMenu");

    await page.click("emptyButton");
    await page.expect().toHaveScreenshot({ name: "empty-account-upsert-form", blur: false });
    await page.expect("drawer").toMatchAriaSnapshot({ name: "empty-account-upsert-form" });
    await page.completeAccountUpsertForm();

    await page.expect("root").toMatchAriaSnapshot({ name: "accounts-tab-with-new-account" });
    await page.click("accountMenu");
    await page.expect("accountMenuOption").toHaveCount(1);
});
