import { test } from "~~/test-utils/playwright";
import { SCREENSHOT } from "~~/test-utils/playwright/tags";

test("should show a custom error page for 404 errors", { tag: SCREENSHOT }, async ({ homePage: page }) => {
    await page.page.goto("/api");
    await page.expect().toBeValid({ name: "404-page" });
});
