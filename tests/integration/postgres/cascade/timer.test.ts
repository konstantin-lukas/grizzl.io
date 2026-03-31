import { expect, test } from "~~/test-utils/vitest";

test("deletes all associated timer intervals when a timer is deleted", async ({ db, user }) => {
    const [timer] = await db.timer.insert(1, { userId: user.id });
    await db.timerInterval.insert(3, { timerId: timer.id });

    await db.timer.delete();

    const intervals = await db.timerInterval.select();

    expect(intervals).toHaveLength(0);
});
