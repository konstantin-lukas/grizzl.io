import { expect, test } from "@@/test-utils/vitest";
import BaseRepository from "~~/server/repositories/base.repository";

test("removes the deleted status from database entries if they have a deletedAt column", async ({ db, user }) => {
    const softDeletableRepository = new BaseRepository(db.client, "timer");

    const [timer] = await db.timer.insert({ count: 5, overrides: { userId: user.id, deletedAt: new Date() } });
    await db.timerInterval.insert({ overrides: { timerId: timer.id } });

    await softDeletableRepository.undelete({ id: timer.id, userId: user.id });

    const timersAfterUndelete = await db.timer.select();
    const { notDeleted, deleted } = Object.groupBy(timersAfterUndelete, ({ deletedAt }) => {
        if (deletedAt) return "deleted";
        return "notDeleted";
    });

    expect(deleted).toHaveLength(4);
    expect(notDeleted![0]).toHaveProperty("id", timer.id);
    expect(notDeleted![0]).toHaveProperty("deletedAt", null);
});

test("does nothing on an undeletable entity", async ({ db, user }) => {
    const deletableRepository = new BaseRepository(db.client, "account" as "timer");

    const [account] = await db.account.insert({ overrides: { userId: user.id } });
    await deletableRepository.delete({ id: account.id, userId: user.id });
    await deletableRepository.undelete({ id: account.id, userId: user.id });

    expect(await db.account.select()).toHaveLength(0);
});
