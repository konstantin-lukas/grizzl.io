import { str } from "@@/tests/utils/helpers";
import { expect, test } from "@e2e/fixtures";
import { testRedirectWhenLoggedOut } from "@e2e/utils/helpers";

test.beforeEach(async ({ db }) => {
    await db.timer.reset();
});

testRedirectWhenLoggedOut("/timer");

const title = str(100);
const intervals = [
    { title: str(10), duration: 42, repeatCount: 3, type: 0 },
    { title: str(15), duration: 69, repeatCount: 1, type: 1 },
];

test("allows creating a new timer when no timers exist", async ({ timerPage, db }) => {
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

test("allows deleting and restoring an existing timer", async ({ timerPage, db }) => {
    const [timer] = await db.timer.insert({ count: 1 });
    await db.timerInterval.insert(timer.id);
    await timerPage.goto();

    expect(timer.deleted).toBe(false);
    await timerPage.expect("listItemTitles").toHaveText(timer.title);
    await timerPage.click("listItemDeleteButtons");
    await timerPage.expect("listItemTitles").toBeDisattached();

    const [updatedTimer] = await db.timer.select(timer.id);
    expect(updatedTimer.deleted).toBe(true);

    await timerPage.click("undeleteButton");
    await timerPage.expect("listItemTitles").toHaveText(timer.title);

    const [restoredTimer] = await db.timer.select(timer.id);
    expect(restoredTimer.deleted).toBe(false);
});

test("allows creating timers with multiple intervals", async ({ timerPage, db }) => {
    await timerPage.goto();
    await timerPage.click("emptyButton");
    await timerPage.createTimer({
        title,
        intervals,
    });

    const createdIntervals = await db.timerInterval.select();

    expect(createdIntervals).toHaveLength(2);

    expect(createdIntervals[0].title).toBe(intervals[0].title);
    expect(createdIntervals[0].duration).toBe(intervals[0].duration * 1000);
    expect(createdIntervals[0].repeatCount).toBe(intervals[0].repeatCount);
    expect(createdIntervals[0].beatPattern).toBe(null);

    expect(createdIntervals[1].title).toBe(intervals[1].title);
    expect(createdIntervals[1].duration).toBe(intervals[1].duration * 1000);
    expect(createdIntervals[1].repeatCount).toBe(intervals[1].repeatCount);
    expect(createdIntervals[1].beatPattern).toEqual(["high", "low", "low", "low"]);

    await timerPage.expect("listItemLengths").toHaveText("2 rounds (111 seconds)");
});

test("allows changing interval order and deleting intervals", async ({ timerPage }) => {
    await timerPage.goto();
    await timerPage.click("emptyButton");
    await timerPage.createTimer(
        {
            title,
            intervals,
        },
        false,
    );

    await timerPage.expect("legends", { nth: 0 }).toHaveText("Interval No. 1");
    await timerPage.expect("intervalTitleInputs", { nth: 0 }).toHaveValue(intervals[0].title);
    await timerPage.expect("repetitionsInputs", { nth: 0 }).toHaveValue(intervals[0].repeatCount.toString());
    await timerPage.expect("durationInputs", { nth: 0 }).toHaveValue(`${intervals[0].duration} sec`);
    await timerPage.expect("typeSelect", { nth: 0 }).toHaveText("Standard");

    await timerPage.focus("intervalTitleInputs", { nth: 0 });
    await timerPage.click("moveDownButtons", { nth: 0 });

    await timerPage.expect("legends", { nth: 0 }).toHaveText("Interval No. 1");
    await timerPage.expect("intervalTitleInputs", { nth: 0 }).toHaveValue(intervals[1].title);
    await timerPage.expect("repetitionsInputs", { nth: 0 }).toHaveValue(intervals[1].repeatCount.toString());
    await timerPage.expect("durationInputs", { nth: 0 }).toHaveValue(`${intervals[1].duration} sec`);
    await timerPage.expect("typeSelect", { nth: 0 }).toHaveText("Rhythm");

    await timerPage.focus("intervalTitleInputs", { nth: 0 });
    await timerPage.click("deleteButtons", { nth: 0 });

    await timerPage.expect("legends").toHaveCount(1);
    await timerPage.expect("legends").toHaveText("Interval No. 1");
    await timerPage.expect("intervalTitleInputs").toHaveValue(intervals[0].title);
    await timerPage.expect("repetitionsInputs").toHaveValue(intervals[0].repeatCount.toString());
    await timerPage.expect("durationInputs").toHaveValue(`${intervals[0].duration} sec`);
    await timerPage.expect("typeSelect").toHaveText("Standard");
});
