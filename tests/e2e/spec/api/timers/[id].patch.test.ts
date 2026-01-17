import { expect, test } from "@e2e/fixtures";
import { BASE_TIMER, FULL_TIMER } from "@e2e/fixtures/constants/timer";
import { test401WhenLoggedOut, testIdParameter } from "@e2e/utils/helpers";

testIdParameter("patch", "/api/timers", { deleted: true });

test("only allows a user to edit their own timers", async ({ request, db }) => {
    const otherUser = await db.user.select("cmontgomeryburns@springfieldnuclear.com");
    const [timer] = await db.timer.insert({ userId: otherUser.id });
    expect(timer.deleted).toBe(false);
    const response = await request.patch(`/api/timers/${timer.id}`, { data: { deleted: true } });
    expect(response.status()).toBe(404);
    const [patchedTimer] = await db.timer.select(timer.id);
    expect(patchedTimer.id).toBe(timer.id);
});

test("only allows patching the deleted property", async ({ request, db }) => {
    const [timer] = await db.timer.insert();
    const response = await request.patch(`/api/timers/${timer.id}`, { data: { ...FULL_TIMER, deleted: true } });
    expect(response.status()).toBe(204);
    const [patchedTimer] = await db.timer.select(timer.id);
    expect(patchedTimer).toStrictEqual({ ...timer, deleted: true });
});

test("only modifies the requested timer", async ({ request, db }) => {
    const otherUser = await db.user.select("cmontgomeryburns@springfieldnuclear.com");
    const [otherTimer] = await db.timer.insert({ userId: otherUser.id });
    const [timer] = await db.timer.insert();
    expect(timer.deleted).toBe(false);
    expect(otherTimer.deleted).toBe(false);
    await request.patch(`/api/timers/${timer.id}`, { data: { deleted: true } });
    const [timerAfterPatch] = await db.timer.select(timer.id);
    const [otherTimerAfterPatch] = await db.timer.select(otherTimer.id);
    expect(timerAfterPatch).toStrictEqual({ ...timer, deleted: true });
    expect(otherTimerAfterPatch).toStrictEqual(otherTimer);
});

test("allows undoing a delete", async ({ request, db }) => {
    const [timer] = await db.timer.insert({ deleted: true });
    expect(timer.deleted).toBe(true);
    await request.patch(`/api/timers/${timer.id}`, { data: { ...BASE_TIMER, deleted: false } });
    const [patchedTimer] = await db.timer.select(timer.id);
    expect(patchedTimer.deleted).toBe(false);
});

test("returns a 204 even when the data hasn't changed", async ({ request, db }) => {
    const [t] = await db.timer.insert({ count: 1 });
    await db.timerInterval.insert(t.id);
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
