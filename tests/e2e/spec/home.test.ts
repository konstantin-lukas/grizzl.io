import { test } from "@e2e/fixtures";
import { withoutAuth } from "@e2e/utils/auth";

test("contains a link to all available sections and a sign out button", async ({ homePage }) => {
    await homePage.goto();
    await homePage.expect().toHaveScreenshot();
    await homePage.analyzeA11y();
    await homePage.expect("signOutButton").toBeVisible();
    await homePage.expect("signInButton").toBeDisattached();
    await homePage.expect("timerHero", { filter: { visible: true } }).toHaveCount(1);
    await homePage.expect("financeHero", { filter: { visible: true } }).toHaveCount(1);
    await homePage.expect("pollHero", { filter: { visible: true } }).toHaveCount(1);
    await homePage.expect("todoHero", { filter: { visible: true } }).toHaveCount(1);
});

withoutAuth(() => {
    test("contains a link to the sign in page", async ({ homePage }) => {
        await homePage.goto();
        await homePage.expect("signInButton").toBeVisible();
        await homePage.expect("signOutButton").toBeDisattached();
    });
});
