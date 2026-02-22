import { expect, test } from "@@/test-utils/vitest";
import TimerRepository from "~~/server/timer/repositories/timer.repository";
import { BASE_TIMER } from "~~/test-utils/constants/timer";

test("creates a timer with intervals and returns the id of the created timer", async ({ db, user }) => {
    const timerRepository = new TimerRepository(db.client);
    const id = await timerRepository.create(user.id, BASE_TIMER);

    const [timer] = await db.timer.select(id);
    const [interval] = await db.timerInterval.select();

    expect(timer!.id).toBe(id);
    expect(timer).toHaveProperty("id", id);
    expect(timer).toHaveProperty("title", BASE_TIMER.title);
    expect(timer).toHaveProperty("userId", user.id);
    expect(timer).toHaveProperty("ttsVoices", BASE_TIMER.ttsVoices);
    expect(timer).toHaveProperty("deletedAt", null);
    expect(timer).toHaveProperty("createdAt", expect.any(Date));

    expect(interval).toHaveProperty("title", BASE_TIMER.intervals[0]!.title);
    expect(interval).toHaveProperty("duration", BASE_TIMER.intervals[0]!.duration);
    expect(interval).toHaveProperty("preparationTime", BASE_TIMER.intervals[0]!.preparationTime);
    expect(interval).toHaveProperty("repeatCount", BASE_TIMER.intervals[0]!.repeatCount);
    expect(interval).toHaveProperty("beatPattern", BASE_TIMER.intervals[0]!.beatPattern);
    expect(interval).toHaveProperty("timerId", id);
    expect(interval).toHaveProperty("index", 0);
});

test("creates a timer with multiple intervals", async ({ db, user }) => {
    const timerRepository = new TimerRepository(db.client);

    await timerRepository.create(user.id, {
        ...BASE_TIMER,
        intervals: [...BASE_TIMER.intervals, ...BASE_TIMER.intervals],
    });

    const intervals = await db.timerInterval.select();

    expect(intervals).toHaveLength(2);
});

test("throws an error if the input data is faulty", async ({ db, user }) => {
    const timerRepository = new TimerRepository(db.client);
    expect(timerRepository.create(user.id, "" as never)).rejects.toThrow();
});
