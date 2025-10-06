import { expect, test } from "@e2e/fixtures";

test("should have links to all services", async ({ homePage }) => {
    const links = [
        { locator: homePage.loc.pollLink, text: "Polls", href: "/poll" },
        { locator: homePage.loc.todoLink, text: "To-Do", href: "/todo" },
        { locator: homePage.loc.timerLink, text: "Timer", href: "/timer" },
        { locator: homePage.loc.financeLink, text: "Finance", href: "/finance" },
    ];

    await test.step("Check that menu elements do not exist when the menu is closed", async () => {
        await homePage.goto();
        await expect(homePage.loc.menuButton).toBeVisible();
        for (const { locator } of links) {
            await expect(locator).toBeHidden();
        }
    });

    await test.step("Open the menu and check that all links exist", async () => {
        await homePage.loc.menuButton.click();
        for (const { locator, text, href } of links) {
            await expect(locator).toHaveText(text);
            await expect(locator).toHaveAttribute("href", href);
        }
    });
});

test("should make all other page elements not focusable when open", async ({ homePage }) => {
    await homePage.goto();
    await expect(homePage.loc.inertContainer).not.toHaveAttribute("inert");
    await homePage.analyzeA11y();
    await homePage.loc.menuButton.click();
    await expect(homePage.loc.inertContainer).toHaveAttribute("inert");
    await homePage.analyzeA11y();
});

test("should have a button to toggle the theme", async ({ homePage }) => {
    await homePage.goto();

    await test.step("Check that the state before toggling the theme", async () => {
        await expect(homePage.loc.themeToggleLight).toBeHidden();
        await expect(homePage.loc.themeToggleDark).toBeHidden();
        await homePage.loc.menuButton.click();
        await expect(homePage.loc.themeToggleDark).toBeDisattached();
        await expect(homePage.loc.root).toHaveAttribute("data-color-scheme", "light");
        await expect(homePage.loc.root).toHaveAttribute("style", "color-scheme: light;");
    });

    await test.step("Check that the state after toggling the theme", async () => {
        await homePage.loc.themeToggleLight.click();
        await expect(homePage.loc.root).toHaveAttribute("data-color-scheme", "dark");
        await expect(homePage.loc.root).toHaveAttribute("style", "color-scheme: dark;");
        await expect(homePage.loc.themeToggleLight).toBeDisattached();
        await homePage.loc.themeToggleDark.click();
        await expect(homePage.loc.themeToggleDark).toBeDisattached();
    });
});
