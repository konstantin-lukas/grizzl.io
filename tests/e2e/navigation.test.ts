import { test } from "~~/test-utils/playwright";
import { withoutAuth } from "~~/test-utils/playwright/utils/auth";

withoutAuth(() => {
    for (const [path, link] of [
        ["/timer", "timerLink"],
        ["/finance", "financeLink"],
        ["/todo", "todoLink"],
        ["/poll", "pollLink"],
    ] as const) {
        test(`redirects the user to ${path} after signing in through a client-side redirect`, async ({
            homePage: page,
        }) => {
            await page.goto({ target: path });
            await page.click("menuButton");
            await page.click(link);
            await page.expect().toHaveURL(`/signin?callbackURL=${path}`);
            await page.page.getByTestId("keycloak-provider").click();
            await page.page.locator("#username").fill("user");
            await page.page.locator("#password").fill("password");
            await page.page.locator("#kc-login").click();
            await page.expect().toHaveURL(path);
        });
    }

    for (const path of ["/timer", "/finance", "/todo", "/todo/calendar", "/poll"]) {
        test(`redirects the user to ${path} after signing in through a server-side redirect`, async ({
            homePage: page,
        }) => {
            await page.goto({ target: path });
            await page.expect().toHaveURL(`/signin?callbackURL=${path}`);
            await page.page.getByTestId("keycloak-provider").click();
            await page.page.locator("#username").fill("user");
            await page.page.locator("#password").fill("password");
            await page.page.locator("#kc-login").click();
            await page.expect().toHaveURL(path);
        });
    }
});
