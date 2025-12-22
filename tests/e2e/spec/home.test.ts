import { test } from "@e2e/fixtures";
import { withoutAuth } from "@e2e/utils/auth";

test("contains a link to all available sections and a sign out button", async ({ homePage }) => {
    await homePage.goto();
    await homePage.expect("signOutButton").toBeVisible();
    await homePage.expect("signInButton").toBeDisattached();
    await homePage.expect("timerHero", { visible: true }).toHaveCount(1);
    await homePage.expect("financeHero", { visible: true }).toHaveCount(1);
    await homePage.expect("pollHero", { visible: true }).toHaveCount(1);
    await homePage.expect("todoHero", { visible: true }).toHaveCount(1);
});

withoutAuth(() => {
    test("contains a link to the sign in page", async ({ homePage }) => {
        await homePage.goto();
        await homePage.expect("signInButton").toBeVisible();
        await homePage.expect("signOutButton").toBeDisattached();
    });
});
