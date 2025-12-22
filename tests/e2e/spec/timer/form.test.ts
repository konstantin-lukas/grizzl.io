import { str } from "@@/tests/utils/helpers";
import { expect, test } from "@e2e/fixtures";
import { testRedirectWhenLoggedOut } from "@e2e/utils/helpers";

test.beforeEach(async ({ db }) => {
    await db.timer.reset();
});

testRedirectWhenLoggedOut("/timer");

test("allows creating a new timer when no timers exist", async ({ timerPage, db }) => {
    const title = str(100);

    await timerPage.goto();
    await timerPage.expect().toHaveScreenshot();
    await timerPage.analyzeA11y();

    await timerPage.click("emptyButton");

    await timerPage.expect().toHaveScreenshot();
    await timerPage.analyzeA11y();

    await timerPage.createTimer({ title });

    await timerPage.expect("listItemTitles").toHaveText(title);
    await timerPage.expect("listItemLengths").toHaveText("1 round (3 seconds)");

    const [timer] = await db.timer.select();
    expect(timer.title).toBe(title);
});

test("displays an alert if there were form validation errors", async ({ timerPage }) => {
    await timerPage.goto();

    await timerPage.click("emptyButton");
    await timerPage.click("submitButton");

    const errorTitle = "The Submission Failed Due An Error";
    const errorDescription = "The provided text has to be at least 1 character long.";
    await timerPage.expect("formErrors").toHaveText(errorTitle + errorDescription);
});

test("allows editing an existing timer", async ({ timerPage, db }) => {
    const newTitle = str(10);
    const [timer] = await db.timer.insert({ count: 1 });
    await db.timerInterval.insert(timer.id);
    await timerPage.goto();

    await timerPage.expect().toHaveScreenshot();
    await timerPage.expect("listItemTitles").toHaveText(timer.title);

    await timerPage.click("listItemEditButtons");
    await timerPage.fill("titleInput", newTitle);
    await timerPage.click("submitButton");

    await timerPage.expect("listItemTitles").toHaveText(newTitle);
    const [updatedTimer] = await db.timer.select(timer.id);
    expect(updatedTimer.title).toBe(newTitle);
});

test("allows soft-deleting an existing timer", async ({ timerPage, db }) => {
    const [timer] = await db.timer.insert({ count: 1 });
    await db.timerInterval.insert(timer.id);
    await timerPage.goto();

    expect(timer.deleted).toBe(false);
    await timerPage.expect("listItemTitles").toHaveText(timer.title);
    await timerPage.click("listItemDeleteButtons");
    await timerPage.expect("listItemTitles").toBeDisattached();

    const [updatedTimer] = await db.timer.select(timer.id);
    expect(updatedTimer.deleted).toBe(true);
});
