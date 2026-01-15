import { expect, test } from "@e2e/fixtures";
import { withoutAuth } from "@e2e/utils/auth";

test("contains a link to all available sections and a sign out button", async ({ homePage: page }, testInfo) => {
    await page.goto();
    const project = testInfo.project.name;
    const ariaSnapshotName = `contains-a-link-to-all-available-sections-and-a-sign-out-button-${project.includes("mobile") ? "mobile" : "desktop"}-1.aria.yml`;
    await page.expectIntegrity({ ariaSnapshotName });
    await page.expect("signOutButton").toBeVisible();
    await page.expect("signInButton").toBeDisattached();
    await page.expect("timerHero", { filter: { visible: true } }).toHaveCount(1);
    await page.expect("financeHero", { filter: { visible: true } }).toHaveCount(1);
    await page.expect("pollHero", { filter: { visible: true } }).toHaveCount(1);
    await page.expect("todoHero", { filter: { visible: true } }).toHaveCount(1);
});

test("should register a service worker if supported", async ({ homePage: page }) => {
    await page.goto();
    const ready = await page.swReady();
    expect(ready).not.toBe(null);
});

withoutAuth(() => {
    test("contains a link to the sign in page", async ({ homePage: page }) => {
        await page.goto();
        await page.expect("signInButton").toBeVisible();
        await page.expect("signOutButton").toBeDisattached();
    });
});
