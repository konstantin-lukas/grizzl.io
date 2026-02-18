import { beforeEach, expect, test, vi } from "@@/test-utils/vitest";
import BaseRepository from "~~/server/repositories/base.repository";

const errorLogMock = vi.fn();
class LoggerService {
    error = errorLogMock;
}

beforeEach(() => vi.resetAllMocks());

const testCases = [
    {
        title: "does not delete entities from a soft-deletable table when deletedAt is null",
        overrides: () => ({}),
        maxAge: 0,
        expectedCount: 3,
    },
    {
        title: "does not delete entities from a soft-deletable table when maxAge hasn't been reached yet",
        overrides: () => ({ deletedAt: new Date() }),
        maxAge: 1000 * 60 * 60,
        expectedCount: 3,
    },
    {
        title: "only hard-deletes soft-deleted entities that have reached maxAge",
        overrides: (index: number) => ({ deletedAt: index === 0 ? new Date() : new Date("2020-12-31") }),
        maxAge: 1000 * 60 * 60,
        expectedCount: 1,
    },
    {
        title: "deletes all soft-deleted entities if maxAge is 0",
        overrides: () => ({ deletedAt: new Date() }),
        maxAge: 0,
        expectedCount: 0,
    },
];

test.for(testCases)("$title", async ({ overrides, maxAge, expectedCount }, { db, user }) => {
    await db.timer.insert(3, i => ({ userId: user.id, ...overrides(i) }));

    const softDeletableRepository = new BaseRepository(db.client, "timer", new LoggerService() as never);
    await softDeletableRepository.purge({ maxAge });

    const timers = await db.timer.select();
    expect(timers).toHaveLength(expectedCount);
});

test("logs an error and returns when the entity is not soft-deletable", async ({ db, user }) => {
    await db.account.insert(1, { userId: user.id });

    const softDeletableRepository = new BaseRepository(db.client, "account" as "timer", new LoggerService() as never);
    await softDeletableRepository.purge({ maxAge: 0 });

    const accounts = await db.account.select();
    expect(accounts).toHaveLength(1);
    expect(errorLogMock).toHaveBeenCalledExactlyOnceWith(
        'Attempting to purge table that is not soft-deletable: "account".',
    );
});
