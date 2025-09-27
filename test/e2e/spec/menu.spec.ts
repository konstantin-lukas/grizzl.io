import { expect, test } from "@e2e/fixture";

test("should have links to all services", async ({ homePage }) => {
    await homePage.goto();
    await expect(homePage.loc.menuButton).toBeAttached();
    await expect(homePage.loc.pollLink).toBeDisattached();
    await expect(homePage.loc.todoLink).toBeDisattached();
    await expect(homePage.loc.timerLink).toBeDisattached();
    await expect(homePage.loc.financeLink).toBeDisattached();
    await homePage.loc.menuButton.click();
    await expect(homePage.loc.pollLink).toHaveText("Poll");
    await expect(homePage.loc.todoLink).toHaveText("To-Do");
    await expect(homePage.loc.timerLink).toHaveText("Timer");
    await expect(homePage.loc.financeLink).toHaveText("Finance");
    await expect(homePage.loc.sessionButton).toHaveText("Sign Out");
});

test("should have a button to toggle the theme", async ({ homePage }) => {
    await homePage.goto();
    await expect(homePage.loc.themeToggleLight).toBeDisattached();
    await expect(homePage.loc.themeToggleDark).toBeDisattached();
    await homePage.loc.menuButton.click();
    await expect(homePage.loc.themeToggleDark).toBeDisattached();
    await homePage.loc.themeToggleLight.click();
    await expect(homePage.loc.themeToggleLight).toBeDisattached();
    await homePage.loc.themeToggleDark.click();
    await expect(homePage.loc.themeToggleDark).toBeDisattached();
});
