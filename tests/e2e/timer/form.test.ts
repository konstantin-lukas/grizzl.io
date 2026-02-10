import { str } from "@@/test-utils/helpers/data";
import { expect, test } from "~~/test-utils/playwright";

const title = str({ length: 100 });
const intervals = [
    { title: str({ length: 10 }), duration: 42, repeatCount: 3, type: 0 },
    { title: str({ length: 15 }), duration: 69, repeatCount: 1, type: 1 },
];

test("should register a service worker if supported", async ({ timerPage: page }) => {
    await page.goto();
    const ready = await page.swReady();
    expect(ready).not.toBe(null);
});

test("allows creating a new timer when no timers exist", async ({ timerPage: page, db }) => {
    await page.goto();
    await page.expect().toBeValid({ name: "empty-timer-list" });

    await page.click("emptyButton");

    await page.expect().toHaveScreenshot({ name: "timer-creation-form", blur: false });
    await page.expect("drawer").toMatchAriaSnapshot({ name: "timer-creation-form" });

    await page.createTimer({ title });

    await page.expect("listItemTitles").toHaveText(title);
    await page.expect("listItemLengths").toHaveText("1 round (3 seconds)");
    await page.expect("root").toMatchAriaSnapshot({ name: "timer-list-with-a-single-timer" });

    const [timer] = await db.timer.select();
    expect(timer!.title).toBe(title);
});

test("displays an alert if there were form validation errors", async ({ timerPage: page }) => {
    await page.goto();

    await page.click("emptyButton");
    await page.click("submitButton");

    const errorTitle = "The Submission Failed Due An Error";
    const errorDescription = "The provided text has to be at least 1 character long.";
    await page.expect("formErrors").toHaveText(errorTitle + errorDescription);
});

test("allows editing an existing timer", async ({ timerPage: page, db }) => {
    const newTitle = str({ length: 10 });
    const [timer] = await db.timer.insert({ count: 1 });
    await db.timerInterval.insert(timer!.id);
    await page.goto();

    await page.expect().toHaveScreenshot({ name: "timer-list-with-multiple-timers" });
    await page.expect("listItemTitles").toHaveText(timer!.title);

    await page.click("listItemEditButtons");
    await page.fill("titleInput", newTitle);
    await page.click("submitButton");

    await page.expect("listItemTitles").toHaveText(newTitle);
    const [updatedTimer] = await db.timer.select(timer!.id);
    expect(updatedTimer!.title).toBe(newTitle);
});

test("allows deleting and restoring an existing timer", async ({ timerPage: page, db }) => {
    const [timer] = await db.timer.insert({ count: 1 });
    await db.timerInterval.insert(timer!.id);
    await page.goto();

    expect(timer!.deletedAt).toBeNull();
    await page.expect("listItemTitles").toHaveText(timer!.title);
    await page.click("listItemDeleteButtons");
    await page.expect("listItemTitles").toBeDisattached();

    const [updatedTimer] = await db.timer.select(timer!.id);
    expect(updatedTimer!.deletedAt).not.toBeNull();

    await page.click("undeleteButton");
    await page.expect("listItemTitles").toHaveText(timer!.title);

    const [restoredTimer] = await db.timer.select(timer!.id);
    expect(restoredTimer!.deletedAt).toBeNull();
});

test("allows creating timers with multiple intervals", async ({ timerPage: page, db }) => {
    await page.goto();
    await page.click("emptyButton");
    await page.createTimer({
        title,
        intervals,
    });

    const createdIntervals = await db.timerInterval.select();

    expect(createdIntervals).toHaveLength(2);

    expect(createdIntervals[0]!.title).toBe(intervals[0]!.title);
    expect(createdIntervals[0]!.duration).toBe(intervals[0]!.duration * 1000);
    expect(createdIntervals[0]!.repeatCount).toBe(intervals[0]!.repeatCount);
    expect(createdIntervals[0]!.beatPattern).toBe(null);

    expect(createdIntervals[1]!.title).toBe(intervals[1]!.title);
    expect(createdIntervals[1]!.duration).toBe(intervals[1]!.duration * 1000);
    expect(createdIntervals[1]!.repeatCount).toBe(intervals[1]!.repeatCount);
    expect(createdIntervals[1]!.beatPattern).toEqual(["high", "low", "low", "low"]);

    await page.expect("listItemLengths").toHaveText("4 rounds (3 minutes 15 seconds)");
});

test("allows changing interval order and deleting intervals", async ({ timerPage: page }) => {
    await page.goto();
    await page.click("emptyButton");
    await page.createTimer(
        {
            title,
            intervals,
        },
        false,
    );

    await page.expect("legends", { nth: 0 }).toHaveText("Interval No. 1");
    await page.expect("intervalTitleInputs", { nth: 0 }).toHaveValue(intervals[0]!.title);
    await page.expect("repetitionsInputs", { nth: 0 }).toHaveValue(intervals[0]!.repeatCount.toString());
    await page.expect("durationInputs", { nth: 0 }).toHaveValue(`${intervals[0]!.duration} sec`);
    await page.expect("typeSelect", { nth: 0 }).toHaveText("Standard");

    await page.focus("intervalTitleInputs", { nth: 0 });
    await page.click("moveDownButtons", { nth: 0 });

    await page.expect("legends", { nth: 0 }).toHaveText("Interval No. 1");
    await page.expect("intervalTitleInputs", { nth: 0 }).toHaveValue(intervals[1]!.title);
    await page.expect("repetitionsInputs", { nth: 0 }).toHaveValue(intervals[1]!.repeatCount.toString());
    await page.expect("durationInputs", { nth: 0 }).toHaveValue(`${intervals[1]!.duration} sec`);
    await page.expect("typeSelect", { nth: 0 }).toHaveText("Rhythm");

    await page.focus("intervalTitleInputs", { nth: 0 });
    await page.click("deleteButtons", { nth: 0 });

    await page.expect("legends").toHaveCount(1);
    await page.expect("legends").toHaveText("Interval No. 1");
    await page.expect("intervalTitleInputs").toHaveValue(intervals[0]!.title);
    await page.expect("repetitionsInputs").toHaveValue(intervals[0]!.repeatCount.toString());
    await page.expect("durationInputs").toHaveValue(`${intervals[0]!.duration} sec`);
    await page.expect("typeSelect").toHaveText("Standard");
});
