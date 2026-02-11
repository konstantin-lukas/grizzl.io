import { BASE_TIMER, FULL_TIMER } from "~~/test-utils/constants/timer";
import { expect, test } from "~~/test-utils/playwright";
import { test401WhenLoggedOut, testIdParameter } from "~~/test-utils/playwright/utils/helpers";

testIdParameter("patch", "/api/timers", { deleted: true });

test("only allows a user to edit their own timers", async ({ request, db }) => {
    const otherUser = await db.user.select("cmontgomeryburns@springfieldnuclear.com");
    const [timer] = await db.timer.insert(1, { userId: otherUser!.id });
    expect(timer!.deletedAt).toBeNull();
    const response = await request.patch(`/api/timers/${timer!.id}`, { data: { deleted: true } });
    expect(response.status()).toBe(404);
    const [patchedTimer] = await db.timer.select(timer!.id);
    expect(patchedTimer!.id).toBe(timer!.id);
});

test("only allows patching the deleted property", async ({ request, db }) => {
    const [timer] = await db.timer.insert(1);
    const response = await request.patch(`/api/timers/${timer!.id}`, { data: { ...FULL_TIMER, deleted: true } });
    expect(response.status()).toBe(204);
    const [patchedTimer] = await db.timer.select(timer!.id);
    const { deletedAt: _, ...expected } = timer!;
    expect(patchedTimer).toStrictEqual(expect.objectContaining(expected));
    expect(patchedTimer!.deletedAt).not.toBeNull();
});

test("only modifies the requested timer", async ({ request, db }) => {
    const otherUser = await db.user.select("cmontgomeryburns@springfieldnuclear.com");
    const [otherTimer] = await db.timer.insert(1, { userId: otherUser!.id });
    const [timer] = await db.timer.insert(1);
    expect(timer!.deletedAt).toBeNull();
    expect(otherTimer!.deletedAt).toBeNull();
    await request.patch(`/api/timers/${timer!.id}`, { data: { deleted: true } });
    const [timerAfterPatch] = await db.timer.select(timer!.id);
    const [otherTimerAfterPatch] = await db.timer.select(otherTimer!.id);

    const { deletedAt: _, ...expected } = timer!;
    expect(timerAfterPatch).toStrictEqual(expect.objectContaining(expected));
    expect(timerAfterPatch!.deletedAt).not.toBeNull();

    expect(otherTimerAfterPatch).toStrictEqual(otherTimer);
});

test("allows undoing a delete", async ({ request, db }) => {
    const [timer] = await db.timer.insert(1, { deletedAt: new Date() });
    expect(timer!.deletedAt).not.toBe(null);
    await request.patch(`/api/timers/${timer!.id}`, { data: { ...BASE_TIMER, deleted: false } });
    const [patchedTimer] = await db.timer.select(timer!.id);
    expect(patchedTimer!.deletedAt).toBeNull();
});

test("returns a 204 even when the data hasn't changed", async ({ request, db }) => {
    const [t] = await db.timer.insert(1);
    await db.timerInterval.insert(2, { timerId: t!.id });
    const getResponseBefore = await request.get("/api/timers");
    const [timerBefore] = await getResponseBefore.json();
    const patchResponse = await request.patch(`/api/timers/${timerBefore.id}`, {
        data: { ...timerBefore, deleted: false },
    });
    expect(patchResponse.status()).toBe(204);
    const getResponseAfter = await request.get("/api/timers");
    const [timerAfter] = await getResponseAfter.json();
    expect(timerBefore).toStrictEqual(timerAfter);
});

test401WhenLoggedOut("patch", "/api/timers");
