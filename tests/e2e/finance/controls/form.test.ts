import { expect, test } from "~~/test-utils/playwright";
import { SCREENSHOT } from "~~/test-utils/playwright/tags";

test.beforeEach(async ({ page }) => {
    await page.clock.install({ time: new Date("2026-04-15T12:00:00Z") });
});

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

test("allows editing an accounts title but not it's currency", async ({ db, financePage: page }) => {
    await db.financeAccount.insert(1);
    await page.goto();

    await page.click("accountMenu");
    await page.click("editAccountButton");

    await page.fill("accountTitleInput", "Bananas");
    await page.expect("accountCurrencySelect").toBeDisabled();

    await page.click("upsertSubmit");
    await page.expect("root").toMatchAriaSnapshot({ name: "account-with-updated-title" });
});

test("allows switching accounts and remembers which account was open last", async ({ db, financePage: page }) => {
    await db.financeAccount.insert(2, i => ({ currency: i === 0 ? "EUR" : "JPY" }));
    await page.goto();

    await page.expect("root").toMatchAriaSnapshot({ name: "first-account" });
    await page.click("accountMenu");
    await page.click("accountMenuOption", { nth: 1 });

    await page.doubleClickEmptyArea();
    await page.expect("root").toMatchAriaSnapshot({ name: "second-account" });
    await page.page.reload();
    await page.expect("root").toMatchAriaSnapshot({ name: "second-account" });
});
