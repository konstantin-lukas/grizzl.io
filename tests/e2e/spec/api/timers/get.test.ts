import { expect, test } from "@@/tests/e2e/fixtures";
import type { DBFixtures } from "@@/tests/e2e/fixtures/db";
import { test401WhenLoggedOut } from "@@/tests/e2e/utils/helpers";
import { sortByCreatedAt } from "@@/tests/utils/sort";

async function buildTimers(db: DBFixtures, options: { deleted?: boolean; userId?: string } = {}) {
    return Promise.all(
        (await db.timer.insert(options)).map(async timer => ({
            id: timer.id,
            title: timer.title,
            createdAt: timer.createdAt.toISOString(),
            ttsVoice: timer.ttsVoice,
            intervals: await (async () => {
                const intervals = await db.timerInterval.insert(timer.id);
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
