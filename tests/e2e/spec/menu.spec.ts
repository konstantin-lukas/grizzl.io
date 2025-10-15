import { expect, test } from "@e2e/fixtures";
import { forEachLocale } from "@e2e/utils/test";

const texts = {
    "de-DE": {
        poll: "Umfragen",
        todo: "To-do",
        timer: "Stoppuhr",
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
    test(`should have links to all services for locale ${locale.language}`, async ({ homePage, goto }) => {
        const links = [
            { locator: homePage.loc.pollLink, text: texts.poll, href: "/poll" },
            { locator: homePage.loc.todoLink, text: texts.todo, href: "/todo" },
            { locator: homePage.loc.timerLink, text: texts.timer, href: "/timer" },
            { locator: homePage.loc.financeLink, text: texts.finance, href: "/finance" },
        ];

        await test.step("Check that menu elements do not exist when the menu is closed", async () => {
            await goto(homePage.url, { waitUntil: "hydration" });
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
}, texts);

test("should make all other page elements not focusable when open", async ({ homePage, goto }) => {
    await goto(homePage.url, { waitUntil: "hydration" });
    await homePage.forEach("inertElements", async el => {
        await expect(el).not.toHaveAttribute("inert");
    });
    await homePage.analyzeA11y();
    await homePage.loc.menuButton.click();
    await homePage.forEach("inertElements", async el => {
        await expect(el).toHaveAttribute("inert");
    });
    await homePage.analyzeA11y();
});

test("should have a button to toggle the theme", async ({ homePage, goto }) => {
    await goto(homePage.url, { waitUntil: "hydration" });

    await test.step("Check that the state before toggling the theme", async () => {
        await expect(homePage.loc.themeToggleLight).toBeHidden();
        await expect(homePage.loc.themeToggleDark).toBeHidden();
        await homePage.loc.menuButton.click();
        await expect(homePage.loc.themeToggleDark).toBeDisattached();
        await expect(homePage.loc.root).toContainClass("light");
        await expect(homePage.loc.root).not.toContainClass("dark");
    });

    await test.step("Check that the state after toggling the theme", async () => {
        await homePage.loc.themeToggleLight.click();
        await expect(homePage.loc.root).toContainClass("dark");
        await expect(homePage.loc.root).not.toContainClass("light");
        await expect(homePage.loc.themeToggleLight).toBeDisattached();
        await homePage.loc.themeToggleDark.click();
        await expect(homePage.loc.themeToggleDark).toBeDisattached();
    });
});
