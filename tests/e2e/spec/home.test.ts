import { test } from "@e2e/fixtures";
import { withoutAuth } from "@e2e/utils/auth";

test("contains a link to all available sections and a sign out button", async ({ homePage }) => {
    await homePage.goto();
    await homePage.expect("signOutButton").toBeVisible();
    await homePage.expect("signInButton").toBeDisattached();
    await homePage.expectFilter("timerHero", { visible: true }).toHaveCount(1);
    await homePage.expectFilter("financeHero", { visible: true }).toHaveCount(1);
    await homePage.expectFilter("pollHero", { visible: true }).toHaveCount(1);
    await homePage.expectFilter("todoHero", { visible: true }).toHaveCount(1);
});

withoutAuth(() => {
    test("contains a link to the sign in page", async ({ homePage }) => {
        await homePage.goto();
        await homePage.expect("signInButton").toBeVisible();
        await homePage.expect("signOutButton").toBeDisattached();
    });
});
