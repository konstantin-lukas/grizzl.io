import { expect, test } from "~~/test-utils/playwright";
import { SCREENSHOT } from "~~/test-utils/playwright/tags";

test("makes all other page elements not focusable when open", async ({ homePage: page }) => {
    await page.goto();
    await page.forEach("inertElements", async el => {
        await expect(el).not.toHaveAttribute("inert");
    });
    await page.expect().toBeAccessible();
    await page.click("menuButton");
    await page.forEach("inertElements", async el => {
        await expect(el).toHaveAttribute("inert");
    });
    await page.expect().toBeAccessible();
});

test("has a button to toggle the theme", async ({ homePage: page }) => {
    await page.goto();

    await test.step("Check that the state before toggling the theme", async () => {
        await page.expect("lightModeIcon").toBeHidden();
        await page.expect("darkModeIcon").toBeHidden();
        await page.click("menuButton");
        await page.expect("lightModeIcon").toBeHidden();
        await page.expect("darkModeIcon").toBeVisible();
        await page.expect("root").toContainClass("light");
        await page.expect("root").not.toContainClass("dark");
    });

    await test.step("Check that the state after toggling the theme", async () => {
        await page.click("themeToggle");
        await page.expect("root").toContainClass("dark");
        await page.expect("root").not.toContainClass("light");
        await page.expect("lightModeIcon").toBeVisible();
        await page.expect("darkModeIcon").toBeHidden();
        await page.click("themeToggle");
        await page.expect("lightModeIcon").toBeHidden();
        await page.expect("darkModeIcon").toBeVisible();
    });
});

test(
    "contains no unexpected changes in accessibility or visual appearance",
    { tag: SCREENSHOT },
    async ({ homePage: page }) => {
        await page.goto();
        await page.click("menuButton");

        const name = "menu-opened-on-home-page";
        await page.expect("menu").toMatchAriaSnapshot({ name });
        await page.expect().toBeAccessible();
        await page.expect("menu").toHaveScreenshot({ name });
        await page.toggleTheme({ openMenu: false, closeMenu: false });
        await page.expect("menu").toHaveScreenshot({ name: `${name}-darkmode` });
    },
);
