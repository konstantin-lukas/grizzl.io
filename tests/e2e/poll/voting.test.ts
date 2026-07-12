import { PollMethod } from "#shared/poll/enums/method.enum";
import type { DBFixtures } from "~~/test-utils/database/fixture";
import { date } from "~~/test-utils/helpers/data";
import { expect, test } from "~~/test-utils/playwright";
import type PollPage from "~~/test-utils/playwright/pages/poll.page";
import { SCREENSHOT } from "~~/test-utils/playwright/tags";

async function setup(page: PollPage, db: DBFixtures, method: PollMethod) {
    const [poll] = await db.poll.insert(1, {
        method,
        title: "What should we have for lunch?",
        choices: ["Japanese", "Korean", "Thai", "Indonesian", "Chinese"],
        closesAt: null,
    });
    await page.goto({ target: `/poll/${poll.id}` });
}

test("does not allow switching back to the voting ui after casting a vote", async ({ pollPage: page, db }) => {
    await setup(page, db, PollMethod.APPROVAL);
    await page.expect("toggleUiButton").toBeVisible();
    await page.click("voteButton");
    await page.expect("toggleUiButton").toBeDisattached();
    await page.page.reload();
    await page.expect("clipboardButton").toBeAttached();
    await page.expect("toggleUiButton").toBeDisattached();
});

test("does not allow voting on a poll that has ended", async ({ pollPage: page, db }) => {
    const [poll] = await db.poll.insert(1, { closesAt: date({ when: "beforeRef" }) });
    await page.goto({ target: `/poll/${poll.id}` });
    await page.expect("clipboardButton").toBeVisible();
    await page.expect("toggleUiButton").toBeDisattached();
});

test("shows an informational alert when the winner requires the majority of votes", async ({ pollPage: page, db }) => {
    const [poll] = await db.poll.insert(1, { majorityWinner: true, closesAt: date({ when: "beforeRef" }) });
    await page.goto({ target: `/poll/${poll.id}` });
    await page.expect().toHaveScreenshot({ name: "results-ui-with-majority-winner-alert" });
});

test("copies the current url to the clipboard when pressing the share button", async ({ pollPage: page, db }) => {
    const [poll] = await db.poll.insert(1, { closesAt: date({ when: "beforeRef" }) });
    await page.goto({ target: `/poll/${poll.id}` });

    await page.page.evaluate(() => {
        (window as unknown as { __copiedText: string }).__copiedText = "";

        navigator.clipboard.writeText = async text => {
            (window as unknown as { __copiedText: string }).__copiedText = text;
        };
    });

    await page.click("clipboardButton");

    const clipboard = await page.page.evaluate(() => (window as unknown as { __copiedText: string }).__copiedText);
    expect(clipboard).toBe(`http://grizzl.localhost/poll/${poll.id}`);
});

for (const method of [PollMethod.PLURALITY, PollMethod.APPROVAL]) {
    test(
        `allows voting on polls of type "${method}" and shows the results after casting a vote"`,
        { tag: SCREENSHOT },
        async ({ db, pollPage: page }) => {
            await setup(page, db, method);
            await page.click("choices", { nth: 1 });
            await page.click("choices", { nth: 3 });
            await page.expect().toBeValid({ name: `${method}-poll-before-voting` });
            await page.click("voteButton");
            await page.expect().toBeValid({ name: `${method}-poll-after-voting`, skipThemeToggle: true });
        },
    );
}

for (const method of [PollMethod.RUNOFF, PollMethod.POSITIONAL]) {
    test(
        `allows voting on polls of type "${method}" and shows the results after casting a vote"`,
        { tag: SCREENSHOT },
        async ({ db, pollPage: page }) => {
            await setup(page, db, method);
            await page.locators.choices.nth(1).dragTo(page.locators.choices.nth(3));
            await page.expect().toBeValid({ name: `${method}-poll-before-voting` });
            await page.click("voteButton");
            await page.expect().toBeValid({ name: `${method}-poll-after-voting`, skipThemeToggle: true });
        },
    );
}

test(
    `allows voting on polls of type "${PollMethod.SCORE}" and shows the results after casting a vote"`,
    { tag: SCREENSHOT },
    async ({ db, pollPage: page }) => {
        await setup(page, db, PollMethod.SCORE);
        await page.page.locator("[role='slider']").nth(1).focus();
        for (let i = 0; i < 4; i++) {
            await page.page.keyboard.press("ArrowRight");
        }
        await page.page.locator("[role='slider']").nth(3).focus();
        for (let i = 0; i < 8; i++) {
            await page.page.keyboard.press("ArrowRight");
        }
        await page.expect().toBeValid({ name: `${PollMethod.SCORE}-poll-before-voting` });
        await page.click("voteButton");
        await page.expect().toBeValid({ name: `${PollMethod.SCORE}-poll-after-voting`, skipThemeToggle: true });
    },
);
