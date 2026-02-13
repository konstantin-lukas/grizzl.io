import { Beat } from "@@/shared/enum/timer";
import { test } from "~~/test-utils/playwright";

test("allows playing a created timer and going back", async ({ timerPage: page, db }) => {
    const [timer] = await db.timer.insert(1);
    const [interval] = await db.timerInterval.insert(1, {
        timerId: timer.id,
        repeatCount: 1,
        duration: 1000,
        beatPattern: null,
    });

    await page.goto();
    await page.click("listItemPlayButtons");

    await page.expect("title").toHaveText(timer.title);
    await page.expect("intervalTitle").toHaveText(interval.title!);
    await page.expect("remainingIntervalTime").toHaveText("00:01");
    await page.expect("remainingTime").toHaveText("00:01");
    await page.expect("activeRound").toHaveText("1/1");
    await page.expect().toBeAccessible();
    await page.expect("slideover").toHaveScreenshot({ name: "timer-playback-before-starting" });

    await page.click("playButton");

    await page.expect("title").toHaveText(timer.title);
    await page.expect("intervalTitle").toHaveText("");
    await page.expect("remainingIntervalTime").toHaveText("––:––");
    await page.expect("remainingTime").toHaveText("00:00");
    await page.expect("activeRound").toHaveText("–/–");
    await page.expect("slideover").toHaveScreenshot({ name: "timer-playback-after-finishing" });

    await page.click("resetButton");

    await page.expect("title").toHaveText(timer.title);
    await page.expect("intervalTitle").toHaveText(interval.title!);
    await page.expect("remainingIntervalTime").toHaveText("00:01");
    await page.expect("remainingTime").toHaveText("00:01");
    await page.expect("activeRound").toHaveText("1/1");

    await page.click("goBack");
    await page.click("listItemPlayButtons");

    await page.expect("title").toHaveText(timer.title);
    await page.expect("intervalTitle").toHaveText(interval.title!);
    await page.expect("remainingIntervalTime").toHaveText("00:01");
    await page.expect("remainingTime").toHaveText("00:01");
    await page.expect("activeRound").toHaveText("1/1");
});

test("shows indicators for beats on timer progress and information on timer and interval lengths", async ({
    timerPage: page,
    db,
}) => {
    const beatPattern = [
        Beat.ACCENTED,
        Beat.PAUSE,
        Beat.NORMAL,
        Beat.PAUSE,
        Beat.NORMAL,
        Beat.PAUSE,
        Beat.NORMAL,
        Beat.ACCENTED,
        Beat.PAUSE,
        Beat.PAUSE,
        Beat.PAUSE,
        Beat.NORMAL,
        Beat.NORMAL,
        Beat.PAUSE,
        Beat.PAUSE,
        Beat.NORMAL,
    ];
    const [timer] = await db.timer.insert(1);
    await db.timerInterval.insert(1, {
        timerId: timer.id,
        beatPattern,
    });
    await db.timerInterval.insert(1, {
        timerId: timer.id,
        index: 1,
        duration: 3000,
        repeatCount: 4,
    });

    await page.goto();
    await page.toggleTheme();
    await page.click("listItemPlayButtons");

    await page.expect("remainingIntervalTime").toHaveText("00:03");
    await page.expect("remainingTime").toHaveText("00:18");
    await page.expect("activeRound").toHaveText("1/6");
    await page.expect("beatIndicator").toHaveCount(8);
    await page
        .expect("slideover")
        .toHaveScreenshot({ name: "timer-playback-with-multiple-intervals-and-beat-indicators" });
});

test("allows pausing, resuming, and resetting timer playback", async ({ timerPage: page, db }) => {
    const [timer] = await db.timer.insert(1);
    await db.timerInterval.insert(1, {
        timerId: timer.id,
        duration: 45000,
    });

    await test.step("Let timer run for some time, then pause and check remaining times", async () => {
        await page.page.clock.install({ time: new Date("2024-02-02T07:00:00") });
        await page.goto();
        await page.page.clock.pauseAt(new Date("2024-02-02T08:00:00"));
        await page.click("listItemPlayButtons");

        await page.expect("remainingTime").toHaveText("01:30");
        await page.expect("remainingIntervalTime").toHaveText("00:45");
        await page.expect("slideover").toMatchAriaSnapshot({ name: "timer-playback-before-starting" });

        await page.click("playButton");
        await page.page.clock.runFor("00:20");
        await page.click("pauseButton");
        await page.page.clock.runFor("00:20");

        await page.expect("remainingTime").toHaveText("01:10");
        await page.expect("remainingIntervalTime").toHaveText("00:25");
    });

    await test.step("Resume timer, let it run some more, then pause and check remaining times", async () => {
        await page.click("playButton");
        await page.page.clock.runFor("00:15");
        await page.click("pauseButton");

        await page.expect("remainingTime").toHaveText("00:55");
        await page.expect("remainingIntervalTime").toHaveText("00:10");
    });

    await test.step("Reset timer playback and check that remaining times are reset", async () => {
        await page.click("resetButton");

        await page.expect("remainingTime").toHaveText("01:30");
        await page.expect("remainingIntervalTime").toHaveText("00:45");
    });

    await test.step("Start timer, let it run again, then pause and check remaining times", async () => {
        await page.click("playButton");
        await page.page.clock.runFor("00:05");
        await page.click("pauseButton");

        await page.expect("remainingTime").toHaveText("01:25");
        await page.expect("remainingIntervalTime").toHaveText("00:40");
        await page.expect("activeRound").toHaveText("1/2");
    });

    await test.step("Let timer run until the next interval, then check that displayed round is correct", async () => {
        await page.page.clock.resume();
        await page.click("playButton");
        await page.page.clock.pauseAt(new Date("2024-02-02T08:01:39"));
        await page.page.clock.resume();

        await page.expect("activeRound").toHaveText("2/2");
    });

    await test.step("Reset timer and check that displayed round is reset", async () => {
        await page.click("resetButton");
        await page.expect("activeRound").toHaveText("1/2");
    });
});
