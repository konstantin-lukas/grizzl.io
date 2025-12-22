import { expect, test } from "@e2e/fixtures";
import { withoutAuth } from "@e2e/utils/auth";

export function testIdParameter(method: "put" | "patch", apiPath: string, data?: object) {
    test("returns a 404 status code when the provided id is unknown", async ({ request }) => {
        const response = await request[method](`${apiPath}/2222222222222222`, { data });
        expect(response.status()).toBe(404);
    });

    test("returns a 400 status code when the provided id has the wrong format", async ({ request }) => {
        const response = await request[method](`${apiPath}/bananas`, { data });
        expect(response.status()).toBe(400);
    });
}

export function test401WhenLoggedOut(method: "get" | "post" | "patch" | "delete" | "put", path: string) {
    withoutAuth(() => {
        test("returns a 401 status code when an unauthenticated request is made", async ({ request }) => {
            const response = await request[method](path);
            expect(response.status()).toBe(401);
        });
    });
}

export function testRedirectWhenLoggedOut(path: string) {
    withoutAuth(() => {
        test("redirects the user to the sign in page when they are not logged in", async ({ page }) => {
            await page.goto(path);
            await expect(page).toHaveURL("/signin");
        });
    });
}

export function testPageIntegrity(path: string) {
    test("contains no unexpected changes in accessibility or visual appearance", async ({ page, goto, homePage }) => {
        await goto(path, { waitUntil: "hydration" });
        await homePage.analyzeA11y();
        await expect(page).toHaveScreenshot();
    });
}
