import { test } from "vitest";
import BaseRepository from "~~/server/repositories/base.repository";
import { createDBConnection } from "~~/test-utils/database/connection";
import TimerIntervalFixture from "~~/test-utils/fixtures/timer-interval.fixture";
import TimerFixture from "~~/test-utils/fixtures/timer.fixture";
import UserFixture from "~~/test-utils/fixtures/user.fixture";

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
