import { test } from "vitest";
import { createDBConnection } from "~~/playwright/fixtures/db";
import TimerIntervalFixture from "~~/playwright/fixtures/db/timer-interval.fixture";
import TimerFixture from "~~/playwright/fixtures/db/timer.fixture";
import UserFixture from "~~/playwright/fixtures/db/user.fixture";
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
