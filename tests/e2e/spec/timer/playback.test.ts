import { Beat } from "@@/shared/enum/timer";
import { test } from "@e2e/fixtures";

test.beforeEach(async ({ db }) => {
    await db.timer.reset();
});

test("allows playing a created timer and going back", async ({ timerPage, db }) => {
    const [timer] = await db.timer.insert({ count: 1 });
    const [interval] = await db.timerInterval.insert(timer.id, {
        count: 1,
        repeatCount: 1,
        duration: 1000,
        beatPattern: null,
    });

    await timerPage.goto();
    await timerPage.click("listItemPlayButtons");

    await timerPage.expect("title").toHaveText(timer.title);
    await timerPage.expect("intervalTitle").toHaveText(interval.title!);
    await timerPage.expect("remainingIntervalTime").toHaveText("00:01");
    await timerPage.expect("remainingTime").toHaveText("00:01");
    await timerPage.expect("activeRound").toHaveText("1/1");
    await timerPage.analyzeA11y();
    await timerPage.expect().toHaveScreenshot();

    await timerPage.click("playButton");

    await timerPage.expect("title").toHaveText(timer.title);
    await timerPage.expect("intervalTitle").toHaveText("");
    await timerPage.expect("remainingIntervalTime").toHaveText("––:––");
    await timerPage.expect("remainingTime").toHaveText("00:00");
    await timerPage.expect("activeRound").toHaveText("–/–");
    await timerPage.expect().toHaveScreenshot();

    await timerPage.click("resetButton");

    await timerPage.expect("title").toHaveText(timer.title);
    await timerPage.expect("intervalTitle").toHaveText(interval.title!);
    await timerPage.expect("remainingIntervalTime").toHaveText("00:01");
    await timerPage.expect("remainingTime").toHaveText("00:01");
    await timerPage.expect("activeRound").toHaveText("1/1");

    await timerPage.click("goBack");
    await timerPage.click("listItemPlayButtons");

    await timerPage.expect("title").toHaveText(timer.title);
    await timerPage.expect("intervalTitle").toHaveText(interval.title!);
    await timerPage.expect("remainingIntervalTime").toHaveText("00:01");
    await timerPage.expect("remainingTime").toHaveText("00:01");
    await timerPage.expect("activeRound").toHaveText("1/1");
});

test("shows indicators for beats on timer progress and information on timer and interval lengths", async ({
    timerPage,
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
    const [timer] = await db.timer.insert({ count: 1 });
    await db.timerInterval.insert(timer.id, {
        count: 1,
        beatPattern,
    });
    await db.timerInterval.insert(timer.id, {
        count: 1,
        index: 1,
        duration: 3000,
        repeatCount: 4,
    });

    await timerPage.goto();
    await timerPage.click("listItemPlayButtons");

    await timerPage.expect("remainingIntervalTime").toHaveText("00:03");
    await timerPage.expect("remainingTime").toHaveText("00:18");
    await timerPage.expect("activeRound").toHaveText("1/6");
    await timerPage.expect("beatIndicator").toHaveCount(8);
    await timerPage.expect().toHaveScreenshot();
});

test("allows pausing, resuming, and resetting timer playback", async ({ timerPage, db }) => {
    const [timer] = await db.timer.insert({ count: 1 });
    await db.timerInterval.insert(timer.id, {
        count: 1,
        duration: 45000,
    });

    await test.step("Let timer run for some time, then pause and check remaining times", async () => {
        await timerPage.page.clock.install({ time: new Date("2024-02-02T07:00:00") });
        await timerPage.goto();
        await timerPage.page.clock.pauseAt(new Date("2024-02-02T08:00:00"));
        await timerPage.click("listItemPlayButtons");

        await timerPage.expect("remainingTime").toHaveText("01:30");
        await timerPage.expect("remainingIntervalTime").toHaveText("00:45");

        await timerPage.click("playButton");
        await timerPage.page.clock.pauseAt(new Date("2024-02-02T08:00:20"));
        await timerPage.click("pauseButton");
        await timerPage.page.clock.pauseAt(new Date("2024-02-02T08:00:40"));

        await timerPage.expect("remainingTime").toHaveText("01:10");
        await timerPage.expect("remainingIntervalTime").toHaveText("00:25");
    });

    await test.step("Resume timer, let it run some more, then pause and check remaining times", async () => {
        await timerPage.click("playButton");
        await timerPage.page.clock.pauseAt(new Date("2024-02-02T08:00:55"));
        await timerPage.click("pauseButton");

        await timerPage.expect("remainingTime").toHaveText("00:55");
        await timerPage.expect("remainingIntervalTime").toHaveText("00:10");
    });

    await test.step("Reset timer playback and check that remaining times are reset", async () => {
        await timerPage.click("resetButton");

        await timerPage.expect("remainingTime").toHaveText("01:30");
        await timerPage.expect("remainingIntervalTime").toHaveText("00:45");
    });

    await test.step("Start timer, let it run again, then pause and check remaining times", async () => {
        await timerPage.click("playButton");
        await timerPage.page.clock.pauseAt(new Date("2024-02-02T08:01:00"));
        await timerPage.click("pauseButton");

        await timerPage.expect("remainingTime").toHaveText("01:25");
        await timerPage.expect("remainingIntervalTime").toHaveText("00:40");
        await timerPage.expect("activeRound").toHaveText("1/2");
    });

    await test.step("Let timer run until the next interval, then check that displayed round is correct", async () => {
        await timerPage.click("playButton");
        await timerPage.page.clock.pauseAt(new Date("2024-02-02T08:01:39"));
        await timerPage.page.clock.resume();

        await timerPage.expect("activeRound").toHaveText("2/2");
    });

    await test.step("Reset timer and check that displayed round is reset", async () => {
        await timerPage.click("resetButton");
        await timerPage.expect("activeRound").toHaveText("1/2");
    });
});
