import type { FullConfig } from "@playwright/test";
import { expect, firefox, selectors } from "@playwright/test";

export default async function GlobalSetup(config: FullConfig) {
    const { baseURL, storageState, testIdAttribute } = config.projects[0].use;
    selectors.setTestIdAttribute(testIdAttribute!);

    const browser = await firefox.launch();
    const page = await browser.newPage();

    await page.goto(`${baseURL}/signin`, { waitUntil: "load" });
    await page.getByTestId("keycloak-provider").click();
    await page.locator("#username").fill("user");
    await page.locator("#password").fill("password");
    await page.locator("#kc-login").click();

    await expect(page).toHaveURL(baseURL!);

    const context = page.context();
    await context.clearCookies({ name: "i18n_redirected" });
    await context.storageState({ path: storageState as string });

    await browser.close();
}
