import { Beat } from "@@/shared/enum/timer";
import { test } from "@e2e/fixtures";

test.beforeEach(async ({ db }) => {
    await db.timer.reset();
});

test("allows playing a created timer", async ({ timerPage, db }) => {
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
    await timerPage.expect("remainingTime").toHaveText("00:01");
    await timerPage.expect("remainingIntervalTime").toHaveText("00:01");
    await timerPage.expect("activeRound").toHaveText("1/1");
    await timerPage.analyzeA11y();
    await timerPage.expect().toHaveScreenshot();

    await timerPage.click("playButton");

    await timerPage.expect("title").toHaveText(timer.title);
    await timerPage.expect("intervalTitle").toHaveText("");
    await timerPage.expect("remainingTime").toHaveText("––:––");
    await timerPage.expect("remainingIntervalTime").toHaveText("00:00");
    await timerPage.expect("activeRound").toHaveText("–/–");
    await timerPage.expect().toHaveScreenshot();

    await timerPage.click("resetButton");

    await timerPage.expect("title").toHaveText(timer.title);
    await timerPage.expect("intervalTitle").toHaveText(interval.title!);
    await timerPage.expect("remainingTime").toHaveText("00:01");
    await timerPage.expect("remainingIntervalTime").toHaveText("00:01");
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

    await timerPage.expect("remainingTime").toHaveText("00:03");
    await timerPage.expect("remainingIntervalTime").toHaveText("00:18");
    await timerPage.expect("activeRound").toHaveText("1/6");
    await timerPage.expect("beatIndicator").toHaveCount(8);
    await timerPage.expect().toHaveScreenshot({
        maxDiffPixelRatio: 0.02,
        maxDiffPixels: 500,
        threshold: 0.01,
        animations: "disabled",
    });
});
