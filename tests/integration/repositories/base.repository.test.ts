import { test } from "@@/test-utils/vitest";
import BaseRepository from "~~/server/repositories/base.repository";

test("soft-deletes database entries if the table has a deletedAt column", async ({ db }) => {
    const softDeletableRepository = new BaseRepository(db.client, "timer");

    const user = await db.user.insert();
    const [timer] = await db.timer.insert({ userId: user.id });
    await db.timerInterval.insert(timer.id);

    await softDeletableRepository.delete({ id: timer.id, userId: user.id });
});
