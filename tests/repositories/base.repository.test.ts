import { test } from "vitest";
import { createDBConnection } from "~~/fixtures";
import TimerIntervalFixture from "~~/fixtures/timer-interval.fixture";
import TimerFixture from "~~/fixtures/timer.fixture";
import UserFixture from "~~/fixtures/user.fixture";
import BaseRepository from "~~/server/repositories/base.repository";

test("soft-deletes database entries if the table has a deletedAt column", async () => {
    const { db } = createDBConnection();
    const timerFixture = new TimerFixture(db);
    const intervalFixture = new TimerIntervalFixture(db);
    const userFixture = new UserFixture(db);
    const softDeletableRepository = new BaseRepository(db, "timer");

    const user = await userFixture.insert();
    const [timer] = await timerFixture.insert({ userId: user.id });
    await intervalFixture.insert(timer.id);

    await softDeletableRepository.delete({ id: timer.id, userId: user.id });
});
