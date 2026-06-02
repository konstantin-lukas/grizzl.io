import { test } from "~~/test-utils/playwright";
import { SCREENSHOT } from "~~/test-utils/playwright/tags";

test("allows creating new todo lists", { tag: SCREENSHOT }, async ({ todoPage: page }) => {
    await page.goto();
    await page.expect().toBeValid({ name: "empty-todo-list-overview" });

    await page.click("addListButton");

    await page.expect("addListButton").toBeEnabled();

    await page.expect().toHaveScreenshot({ name: "todo-list-overview-with-one-item" });
});
