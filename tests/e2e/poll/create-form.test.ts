import { expect, test } from "~~/test-utils/playwright";
import { SCREENSHOT } from "~~/test-utils/playwright/tags";

test(
    "allows creating a new poll and redirects the user to the poll page",
    { tag: SCREENSHOT },
    async ({ pollPage: page, db }) => {
        await page.goto();
        await page.click("createButton");

        await page.click("clearDateTimeButton");
        await page.fill("titleInput", "What should we have for dinner?");
        await page.fill("choiceInputs", "Italian", { nth: 0 });
        await page.fill("choiceInputs", "Korean", { nth: 1 });

        await page.expect("drawer").toBeValid({ name: "poll-create-form", skipThemeToggle: true });
        await page.click("upsertSubmit");

        await expect.poll(async () => await db.poll.select()).toHaveLength(1);

        const polls = await db.poll.select();
        await page.expect().toHaveURL(`/poll/${polls[0]?.id}`);
    },
);

test(
    "closes the form and refreshes the list of polls if the location header is missing",
    { tag: SCREENSHOT },
    async ({ pollPage: page }) => {
        await page.goto();
        await page.click("createButton");

        await page.fill("titleInput", "What should we have for dinner?");
        await page.fill("choiceInputs", "Italian", { nth: 0 });
        await page.fill("choiceInputs", "Korean", { nth: 1 });
        await page.click("clearDateTimeButton");

        await page.page.route("/api/polls", async route => {
            if (route.request().method() !== "POST") return route.continue();

            const response = await route.fetch();

            const headers = { ...response.headers() };
            delete headers.location;

            await route.fulfill({
                response,
                headers,
            });
        });

        await page.click("upsertSubmit");
        await page.click("closeToastButton");
        await page.expect("viewButtons").toBeEnabled();

        await page.expect().toHaveScreenshot({ name: "overview-after-receiving-no-location-header" });
    },
);

test("allows adding and removing items", async ({ pollPage: page }) => {
    await page.goto();
    await page.click("createButton");

    for (let i = 0; i < 18; i++) {
        await page.click("addChoiceButton");
    }

    await page.expect("choiceInputs").toHaveCount(20);
    await page.expect("addChoiceButton").toBeDisattached();

    await page.click("choiceDeleteButtons", { nth: 0 });
    await page.expect("addChoiceButton").toBeAttached();
    await page.expect("choiceInputs").toHaveCount(19);
});
