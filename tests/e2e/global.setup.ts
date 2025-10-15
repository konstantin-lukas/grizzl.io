import type { FullConfig } from "@playwright/test";
import { expect, firefox, selectors } from "@playwright/test";

export default async function GlobalSetup(config: FullConfig) {
    const { baseURL, storageState, testIdAttribute } = config.projects[0].use;
    selectors.setTestIdAttribute(testIdAttribute!);

    const browser = await firefox.launch();
    const context = await browser.newContext();
    const page = await browser.newPage();

    try {
        await context.tracing.start({ screenshots: true, snapshots: true });
        await page.goto(`${baseURL}/signin`);
        await page.getByTestId("keycloak-provider").click();
        await page.locator("#username").fill("user");
        await page.locator("#password").fill("password");
        await page.locator("#kc-login").click();

        await expect(page).toHaveURL(baseURL!);

        await context.clearCookies({ name: "i18n_redirected" });
        await context.storageState({ path: storageState as string });

        await browser.close();
    } catch (error) {
        await context.tracing.stop({
            path: "./test-results/failed-setup-trace.zip",
        });
        await browser.close();
        throw error;
    }
}
