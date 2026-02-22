import type { FullConfig } from "@playwright/test";
import { expect, firefox, selectors } from "@playwright/test";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "~~/database/schema";
import UserFixture from "~~/test-utils/fixtures/user.fixture";

export default async function GlobalSetup(config: FullConfig) {
    const pool = new Pool({
        host: "postgres",
        database: "grizzl",
        user: "admin",
        password: "admin",
        ssl: false,
    });

    const db = drizzle(pool, {
        casing: "snake_case",
        schema,
    });

    const user = new UserFixture(db);
    await user.reset();
    await user.insert(1);

    const { baseURL, storageState, testIdAttribute } = config.projects[0]!.use;
    selectors.setTestIdAttribute(testIdAttribute!);
    const browser = await firefox.launch();
    const page = await browser.newPage();

    for (let retries = 3; retries > 0; ) {
        try {
            await page.goto(`${baseURL}/signin`, { waitUntil: "load" });
            await page.getByTestId("keycloak-provider").click();
            await page.locator("#username").fill("user");
            await page.locator("#password").fill("password");
            await page.locator("#kc-login").click();
            await expect(page).toHaveURL(baseURL!);
            const context = page.context();
            await context.clearCookies({ name: "i18n_redirected" });
            await context.storageState({ path: storageState as string });
            break;
        } catch (error) {
            retries--;
            if (retries === 0) throw error;
            await page.waitForTimeout(5000);
        }
    }

    await browser.close();
}
