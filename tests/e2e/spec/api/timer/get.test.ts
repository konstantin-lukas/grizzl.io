import { sortByCreatedAt } from "@@/tests/utils/sort";
import { expect, test } from "@e2e/fixtures";
import type { DBFixtures } from "@e2e/fixtures/db";

/* ------------------------------------------------------------------------------------------------------------------ */
/*    Helpers                                                                                                         */
/* ------------------------------------------------------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------------------------------------------------------ */
/*    Tests                                                                                                           */
/* ------------------------------------------------------------------------------------------------------------------ */

test.beforeEach(async ({ db }) => {
    await db.timer.reset();
});

test("should allow retrieving a list of timers sorted by creation date", async ({ request, db }) => {
    const timers = await buildTimers(db);
    sortByCreatedAt(timers, "desc");
    const response = await request.get("/api/timers");
    expect(response.status()).toBe(200);
    expect(await response.json()).toStrictEqual(timers);
});

test("should return an empty array when there are no timers", async ({ request }) => {
    const response = await request.get("/api/timers");
    expect(response.status()).toBe(200);
    expect(await response.json()).toStrictEqual([]);
});

test("should not return soft-deleted timers", async ({ request, db }) => {
    await buildTimers(db, { deleted: true });
    const response = await request.get("/api/timers");
    expect(response.status()).toBe(200);
    expect(await response.json()).toStrictEqual([]);
});

test("should not return timers from other users", async ({ request, db }) => {
    const user = await db.user.select("cmontgomeryburns@springfieldnuclear.com");
    await buildTimers(db, { userId: user.id });
    const response = await request.get("/api/timers");
    expect(response.status()).toBe(200);
    expect(await response.json()).toStrictEqual([]);
});
