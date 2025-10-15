import { test as setup } from "@playwright/test";

setup("authenticate", async ({ page }) => {
    await page.goto("/signin");
    await page.getByTestId("keycloak-provider").click();
    await page.locator("#username").fill("user");
    await page.locator("#password").fill("password");
    await page.locator("#kc-login").click();
    await page.context().clearCookies({ name: "i18n_redirected" });
    await page.context().storageState({ path: "./storage.json" });
});
