import { expect, test } from "~~/test-utils/playwright";
import { SCREENSHOT } from "~~/test-utils/playwright/tags";

test("should register a service worker when supported", async ({ financePage: page }) => {
    await page.goto();
    const ready = await page.swReady();
    expect(ready).not.toBe(null);
});

test("allows creating a new account and deleting it", { tag: SCREENSHOT }, async ({ financePage: page }) => {
    await page.goto();

    await test.step("check page state before creating an account", async () => {
        await page.expect().toBeValid({ name: "no-existing-account" });
        await page.click("accountMenu");
        await page.expect("accountMenuOption").toBeDisattached();
        await page.click("accountMenu");
    });

    await test.step("check and fill creation form", async () => {
        await page.click("emptyButton");
        await page.expect("drawer").toHaveScreenshot({ name: "empty-account-upsert-form" });
        await page.expect("drawer").toMatchAriaSnapshot({ name: "empty-account-upsert-form" });
        await page.completeAccountUpsertForm();
        await page.click("closeToastButton");
    });

    await test.step("check page state after creating an account", async () => {
        await page.expect("root").toBeValid({ name: "accounts-tab-with-new-account" });
        await page.click("accountMenu");
        await page.expect("accountMenuOption").toHaveCount(1);
    });

    await test.step("check that page state is the same after deleting the last account as before creating it", async () => {
        await page.click("deleteAccountButton");
        await page.click("closeToastButton");
        await page.expect("root").toMatchAriaSnapshot({ name: "no-existing-account" });
    });

    await test.step("check that creation form can be opened from the account menu", async () => {
        await page.click("createAccountButton");
        await page.expect("drawer").toMatchAriaSnapshot({ name: "empty-account-upsert-form" });
    });
});
