import { expect, test } from "@@/tests/e2e/fixtures";
import { forEachLocale } from "@@/tests/e2e/utils/locale";

const texts = {
    "de-DE": {
        poll: "Umfragen",
        todo: "To-do",
        timer: "Timer",
        finance: "Finanzen",
    },
    "en-US": {
        poll: "Polls",
        todo: "To-Do",
        timer: "Timer",
        finance: "Finance",
    },
    "es-ES": {
        poll: "Encuestas",
        todo: "Tareas",
        timer: "Temporizador",
        finance: "Finanzas",
    },
    "ja-JP": {
        poll: "アンケート",
        todo: "ToDoリスト",
        timer: "タイマー",
        finance: "財務",
    },
};

forEachLocale((locale, texts) => {
    test(`has links to all services for locale ${locale.language}`, async ({ homePage: page }) => {
        const links = [
            { locator: "pollLink", text: texts.poll, href: "" },
            { locator: "todoLink", text: texts.todo, href: "" },
            { locator: "timerLink", text: texts.timer, href: "/timer" },
            { locator: "financeLink", text: texts.finance, href: "" },
        ] as const;

        await test.step("Check that menu elements do not exist when the menu is closed", async () => {
            await page.goto();
            await page.expect("menuButton").toBeVisible();
            for (const { locator } of links) {
                await page.expect(locator).toBeHidden();
            }
        });

        await test.step("Open the menu and check that all links exist", async () => {
            await page.click("menuButton");
            for (const { locator, text, href } of links) {
                await page.expect(locator).toHaveText(text);
                if (href === "") {
                    await page.expect(locator).not.toHaveAttribute("href");
                    continue;
                }
                await page.expect(locator).toHaveAttribute("href", href);
            }
        });
    });
}, texts);

test("makes all other page elements not focusable when open", async ({ homePage: page }) => {
    await page.goto();
    await page.forEach("inertElements", async el => {
        await expect(el).not.toHaveAttribute("inert");
    });
    await page.analyzeA11y();
    await page.click("menuButton");
    await page.forEach("inertElements", async el => {
        await expect(el).toHaveAttribute("inert");
    });
    await page.analyzeA11y();
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

test("contains no unexpected changes in accessibility or visual appearance", async ({ homePage: page }) => {
    await page.goto();
    await page.click("menuButton");
    await page.expect("menu").toMatchAriaSnapshot();
    await page.analyzeA11y();
    await page.expect().toHaveScreenshot();
    await page.toggleTheme({ openMenu: false, closeMenu: false });
    await page.expect().toHaveScreenshot();
});
