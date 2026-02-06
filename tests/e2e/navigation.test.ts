import { test } from "~~/test-utils/playwright";
import { withoutAuth } from "~~/test-utils/playwright/utils/auth";

withoutAuth(() => {
    const protectedPaths = ["/timer"];
    for (const path of protectedPaths) {
        test(`redirects the user to ${path} after signing in through a client-side redirect`, async ({
            homePage: page,
        }) => {
            await page.goto();
            await page.click("menuButton");
            await page.click("timerLink");
            await page.expect().toHaveURL("/signin?callbackURL=/timer");
            await page.page.getByTestId("keycloak-provider").click();
            await page.page.locator("#username").fill("user");
            await page.page.locator("#password").fill("password");
            await page.page.locator("#kc-login").click();
            await page.expect().toHaveURL("/timer");
        });

        test(`redirects the user to ${path} after signing in through a server-side redirect`, async ({
            timerPage: page,
        }) => {
            await page.goto();
            await page.expect().toHaveURL("/signin?callbackURL=/timer");
            await page.page.getByTestId("keycloak-provider").click();
            await page.page.locator("#username").fill("user");
            await page.page.locator("#password").fill("password");
            await page.page.locator("#kc-login").click();
            await page.expect().toHaveURL("/timer");
        });
    }
});
