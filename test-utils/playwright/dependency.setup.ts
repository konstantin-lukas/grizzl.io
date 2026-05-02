import { expect } from "@playwright/test";
import { test } from "~~/test-utils/playwright/index";

test("logs in the user", async ({ page, db }) => {
    await db.user.reset();
    await db.user.insert(1);

    await page.goto("/signin");
    const context = page.context();
    await context.addInitScript(() => {
        localStorage.setItem("hide-cookie-banner", "true");
    });
    await page.getByTestId("keycloak-provider").click();
    await page.locator("#username").fill("user");
    await page.locator("#password").fill("password");
    await page.locator("#kc-login").click();
    await expect(page).toHaveURL("/");
    await context.clearCookies({ name: "i18n_redirected" });
    await context.storageState({ path: "./test-utils/playwright/storage.json" });
});
