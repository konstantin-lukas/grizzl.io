import { describe, expect, test } from "@@/test-utils/vitest";
import BaseRepository from "~~/server/repositories/base.repository";

describe("delete", () => {
    test("soft-deletes database entries if the table has a deletedAt column", async ({ db, user }) => {
        const softDeletableRepository = new BaseRepository(db.client, "timer");

        const [timer] = await db.timer.insert({ userId: user.id });
        const intervalsBeforeDelete = await db.timerInterval.insert(timer.id);

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
        const account = await db.account.insert({ userId: user.id });

        expect(await db.account.select()).toHaveLength(1);

        await deletableRepository.delete({ id: account.id, userId: user.id });

        expect(await db.account.select()).toHaveLength(0);
    });
});

describe("undelete", () => {
    test("removes the deleted status from database entries if they have a deletedAt column", async ({ db, user }) => {
        const softDeletableRepository = new BaseRepository(db.client, "timer");

        const [timer] = await db.timer.insert({ userId: user.id, deleted: true });
        await db.timerInterval.insert(timer.id);

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

        const account = await db.account.insert({ userId: user.id });
        await deletableRepository.delete({ id: account.id, userId: user.id });
        await deletableRepository.undelete({ id: account.id, userId: user.id });

        expect(await db.account.select()).toHaveLength(0);
    });
});
