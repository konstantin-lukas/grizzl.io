import type { DBFixtures } from "~~/test-utils/database/fixture";
import { sortByCreatedAt } from "~~/test-utils/helpers/sort";
import { expect, test } from "~~/test-utils/playwright";
import {
    test401WhenLoggedOut,
    testGetCollectionOwnership,
    testGetEmptyCollection,
} from "~~/test-utils/playwright/utils/helpers";

async function buildTimers(db: DBFixtures, options: { deleted?: boolean; userId?: string } = {}) {
    return Promise.all(
        (
            await db.timer.insert(1, {
                deletedAt: options.deleted ? new Date() : null,
                ...(options.userId ? { userId: options.userId } : {}),
            })
        ).map(async timer => ({
            id: timer.id,
            title: timer.title,
            createdAt: timer.createdAt.toISOString(),
            ttsVoices: timer.ttsVoices,
            intervals: await (async () => {
                const intervals = await db.timerInterval.insert(2, { timerId: timer.id });
                return intervals.map(({ title, duration, preparationTime, beatPattern, id, repeatCount }) => ({
                    title,
                    duration,
                    preparationTime,
                    beatPattern,
                    id,
                    repeatCount,
                }));
            })(),
        })),
    );
}

const route = "/api/timers";

test401WhenLoggedOut("get", route);
testGetEmptyCollection(route);
testGetCollectionOwnership(async (db, userId) => {
    await buildTimers(db, { userId });
    return route;
});

test("allows retrieving a list of resources sorted by creation date", async ({ request, db }) => {
    const data = await buildTimers(db);
    sortByCreatedAt(data, "desc");
    const response = await request.get(route);
    expect(response.status()).toBe(200);
    expect(await response.json()).toStrictEqual(data);
});

test("does not return soft-deleted resources", async ({ request, db }) => {
    await buildTimers(db, { deleted: true });
    const response = await request.get(route);
    expect(response.status()).toBe(200);
    expect(await response.json()).toStrictEqual([]);
});
