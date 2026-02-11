import { expect, test } from "@@/test-utils/vitest";
import TimerRepository from "~~/server/repositories/timer.repository";
import { BASE_TIMER } from "~~/test-utils/constants/timer";
import { anyId } from "~~/test-utils/vitest/patterns";

let id = "";
test.beforeEach(async ({ db, user }) => {
    const timers = await db.timer.insert(5, { userId: user.id });
    [{ id }] = timers;
    for (const timer of timers) {
        await db.timerInterval.insert(2, { timerId: timer.id });
    }
});

test("updates timers overriding previous intervals and returns the number of updated or created rows", async ({
    db,
    user,
}) => {
    const timerRepository = new TimerRepository(db.client);
    const rows = await timerRepository.update(id, user.id, BASE_TIMER);
    const [timer] = await db.timer.select(id);
    const intervals = await db.timerInterval.select();
    const intervalsForTimer = intervals.filter(({ timerId }) => timerId === timer!.id);

    expect(rows).toBe(2);
    expect(timer).toStrictEqual({
        title: BASE_TIMER.title,
        ttsVoice: BASE_TIMER.ttsVoice,
        id: anyId,
        userId: user.id,
        createdAt: expect.any(Date),
        deletedAt: null,
    });
    expect(intervalsForTimer).toHaveLength(1);
    expect(intervals).toHaveLength(9);
    expect(intervalsForTimer).toStrictEqual([
        {
            beatPattern: ["high", "low"],
            duration: 10000,
            id: anyId,
            index: 0,
            repeatCount: 1,
            timerId: timer!.id,
            title: "Crunches",
        },
    ]);
});

test("throws an error if the input data is faulty", async ({ db, user }) => {
    const timerRepository = new TimerRepository(db.client);
    await expect(timerRepository.update(id, user.id, "" as never)).rejects.toThrow();
});

test("returns 0 when the given timer id doesn't exist", async ({ db, user }) => {
    const timerRepository = new TimerRepository(db.client);
    const rows = await timerRepository.update("bananas", user.id, BASE_TIMER);
    expect(rows).toBe(0);
});

test("returns 0 when the given user id doesn't exist", async ({ db }) => {
    const timerRepository = new TimerRepository(db.client);
    const rows = await timerRepository.update(id, "bananas", BASE_TIMER);
    expect(rows).toBe(0);
});

test("updates existing intervals instead of replacing them if an existing id was provided", async ({ db, user }) => {
    const timerRepository = new TimerRepository(db.client);
    const [timer] = await db.timer.insert(1, { userId: user.id });
    const intervals = await db.timerInterval.insert(2, { timerId: timer.id });
    const secondInterval = intervals.find(({ index }) => index === 1)!;

    const rows = await timerRepository.update(timer.id, user.id, {
        ...timer,
        intervals: [{ ...secondInterval, title: "New Title", beatPattern: null }, ...BASE_TIMER.intervals],
    });
    const intervalsAfterUpdate = await db.timerInterval.select();
    const recycledInterval = intervalsAfterUpdate.find(({ id: intervalId }) => intervalId === secondInterval.id);

    expect(rows).toBe(3);
    expect(recycledInterval).toStrictEqual({ ...secondInterval, title: "New Title", index: 0 });
    expect(intervalsAfterUpdate.length).toBe(12);
});
