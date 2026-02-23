import { expect, test } from "@@/test-utils/vitest";
import BaseRepository from "~~/server/core/repositories/base.repository";

test("soft-deletes database entries if the table has a deletedAt column", async ({ db, user }) => {
    const softDeletableRepository = new BaseRepository(db.client, "timer");

    const [timer] = await db.timer.insert(5, { userId: user.id });
    const intervalsBeforeDelete = await db.timerInterval.insert(2, { timerId: timer.id });

    await softDeletableRepository.delete({ id: timer.id, userId: user.id });

    const timersAfterDelete = await db.timer.select();
    const intervalsAfterDelete = await db.timerInterval.select();
    const { notDeleted, deleted } = Object.groupBy(timersAfterDelete, ({ deletedAt }) => {
        if (deletedAt) return "deleted";
        return "notDeleted";
    });

    expect(notDeleted).toHaveLength(4);
    expect(deleted![0]).toHaveProperty("id", timer.id);
    expect(deleted![0]).toHaveProperty("deletedAt", expect.any(Date));
    expect(intervalsBeforeDelete).toStrictEqual(intervalsAfterDelete);
});

test("deletes database entries if the table does not have a deletedAt column", async ({ db, user }) => {
    const deletableRepository = new BaseRepository(db.client, "account" as "timer");
    const [account] = await db.account.insert(1, { userId: user.id });

    expect(await db.account.select()).toHaveLength(1);

    await deletableRepository.delete({ id: account.id, userId: user.id });

    expect(await db.account.select()).toHaveLength(0);
});
