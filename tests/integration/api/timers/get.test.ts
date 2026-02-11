import type { DBFixtures } from "~~/test-utils/database/fixture";
import { sortByCreatedAt } from "~~/test-utils/helpers/sort";
import { expect, test } from "~~/test-utils/playwright";
import { test401WhenLoggedOut } from "~~/test-utils/playwright/utils/helpers";

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
            ttsVoice: timer.ttsVoice,
            intervals: await (async () => {
                const intervals = await db.timerInterval.insert(2, { timerId: timer!.id });
                return intervals.map(({ title, duration, beatPattern, id, repeatCount }) => ({
                    title,
                    duration,
                    beatPattern,
                    id,
                    repeatCount,
                }));
            })(),
        })),
    );
}

test("allows retrieving a list of timers sorted by creation date", async ({ request, db }) => {
    const timers = await buildTimers(db);
    sortByCreatedAt(timers, "desc");
    const response = await request.get("/api/timers");
    expect(response.status()).toBe(200);
    expect(await response.json()).toStrictEqual(timers);
});

test("returns an empty array when there are no timers", async ({ request }) => {
    const response = await request.get("/api/timers");
    expect(response.status()).toBe(200);
    expect(await response.json()).toStrictEqual([]);
});

test("does not return soft-deleted timers", async ({ request, db }) => {
    await buildTimers(db, { deleted: true });
    const response = await request.get("/api/timers");
    expect(response.status()).toBe(200);
    expect(await response.json()).toStrictEqual([]);
});

test("does not return timers from other users", async ({ request, db }) => {
    const user = await db.user.select("cmontgomeryburns@springfieldnuclear.com");
    await buildTimers(db, { userId: user!.id });
    const response = await request.get("/api/timers");
    expect(response.status()).toBe(200);
    expect(await response.json()).toStrictEqual([]);
});

test401WhenLoggedOut("get", "/api/timers");
