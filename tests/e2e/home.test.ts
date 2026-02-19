import { expect, test } from "~~/test-utils/playwright";
import { SCREENSHOT } from "~~/test-utils/playwright/tags";
import { withoutAuth } from "~~/test-utils/playwright/utils/auth";

test(
    "contains a link to all available sections and a sign out button",
    { tag: SCREENSHOT },
    async ({ homePage: page }, testInfo) => {
        await page.goto();
        const project = testInfo.project.name;
        const baseName = "home-page-right-after-navigation";
        const ariaSnapshotName = `${baseName}-on-${project.includes("mobile") ? "mobile" : "desktop"}`;
        await page.expect().toBeValid({ screenshotName: baseName, ariaName: ariaSnapshotName });
        await page.expect("signOutButton").toBeVisible();
        await page.expect("signInButton").toBeDisattached();
        await page.expect("timerHero", { filter: { visible: true } }).toHaveCount(1);
        await page.expect("financeHero", { filter: { visible: true } }).toHaveCount(1);
        await page.expect("pollHero", { filter: { visible: true } }).toHaveCount(1);
        await page.expect("todoHero", { filter: { visible: true } }).toHaveCount(1);
    },
);

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
