import { test } from "~~/test-utils/playwright";
import { SCREENSHOT } from "~~/test-utils/playwright/tags";

test("displays an empty view when there are no polls", { tag: SCREENSHOT }, async ({ pollPage: page }) => {
    await page.goto();
    await page.expect().toBeValid({ name: "poll-overview-empty" });
});

test("allows soft-deleting items", { tag: SCREENSHOT }, async ({ pollPage: page, db }) => {
    const [poll] = await db.poll.insert(1);
    await db.pollVote.insert(2, { pollId: poll.id });
    await page.goto();

    await page.expect().toBeValid({ name: "poll-overview-with-one-item" });

    await page.click("deleteButtons");
    await page.click("closeToastButton");
    await page.expect("root").toMatchAriaSnapshot({ name: "poll-overview-empty" });

    await page.page.reload();
    await page.expect("root").toMatchAriaSnapshot({ name: "poll-overview-empty" });
});

test("allows undoing a soft-delete", { tag: SCREENSHOT }, async ({ pollPage: page, db }) => {
    const [poll] = await db.poll.insert(1);
    await db.pollVote.insert(2, { pollId: poll.id });
    await page.goto();

    await page.expect().toBeValid({ name: "poll-overview-with-one-item" });

    await page.click("deleteButtons");
    await page.click("undeleteButton");
    await page.expect("root").toMatchAriaSnapshot({ name: "poll-overview-with-one-item" });

    await page.page.reload();
    await page.expect("root").toMatchAriaSnapshot({ name: "poll-overview-with-one-item" });
});
