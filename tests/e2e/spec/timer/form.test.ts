import { str } from "@@/tests/utils/helpers";
import { test } from "@e2e/fixtures";
import { testRedirectWhenLoggedOut } from "@e2e/utils/helpers";

test.beforeEach(async ({ db }) => {
    await db.timer.reset();
});

testRedirectWhenLoggedOut("/timer");

test("allows creating a new timer when no timers exist", async ({ timerPage }) => {
    const timer = { title: str(100) };

    await timerPage.goto();
    await timerPage.expect().toHaveScreenshot();
    await timerPage.analyzeA11y();

    await timerPage.click("emptyButton");

    await timerPage.expect().toHaveScreenshot();
    await timerPage.analyzeA11y();

    await timerPage.createTimer(timer);

    await timerPage.expect("timerListItemTitle").toHaveText(timer.title);
    await timerPage.expect("timerListItemLength").toHaveText("1 round (3 seconds)");
});

test("displays an alert if there were form validation errors", async ({ timerPage }) => {
    await timerPage.goto();

    await timerPage.click("emptyButton");
    await timerPage.click("submitButton");

    const errorTitle = "The Submission Failed Due An Error";
    const errorDescription = "The provided text has to be at least 1 character long.";
    await timerPage.expect("formErrors").toHaveText(errorTitle + errorDescription);
});
