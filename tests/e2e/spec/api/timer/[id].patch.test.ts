import { expect, test } from "@e2e/fixtures";
import { BASE_TIMER } from "@e2e/fixtures/constants/timer";

test.beforeEach(async ({ db }) => {
    await db.timer.reset();
});

test("should only allow a user to edit their own timers", async ({ request, db }) => {
    const otherUser = await db.user.select("cmontgomeryburns@springfieldnuclear.com");
    const [timer] = await db.timer.insert({ userId: otherUser.id });
    expect(timer.deleted).toBe(false);
    const response = await request.patch(`/api/timers/${timer.id}`, { data: { deleted: true } });
    expect(response.status()).toBe(404);
    const [patchedTimer] = await db.timer.select(timer.id);
    expect(patchedTimer.id).toBe(timer.id);
});

test("should only allow patching the deleted property", async ({ request, db }) => {
    const [timer] = await db.timer.insert();
    const response = await request.patch(`/api/timers/${timer.id}`, { data: { ...BASE_TIMER, deleted: true } });
    expect(response.status()).toBe(204);
    const [patchedTimer] = await db.timer.select(timer.id);
    expect(patchedTimer).toStrictEqual({ ...timer, deleted: true });
});

test("should return a 404 status code when the provided id is unknown", async ({ request }) => {
    const response = await request.patch("/api/timers/2222222222222222", { data: { ...BASE_TIMER, deleted: true } });
    expect(response.status()).toBe(404);
});

test("should return a 400 status code when the provided id has the wrong format", async ({ request }) => {
    const response = await request.patch("/api/timers/bananas", { data: { ...BASE_TIMER, deleted: true } });
    expect(response.status()).toBe(400);
});

test("should only modify the requested timer", async ({ request, db }) => {
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

test("should allow undoing a delete", async ({ request, db }) => {
    const [timer] = await db.timer.insert({ deleted: true });
    expect(timer.deleted).toBe(true);
    await request.patch(`/api/timers/${timer.id}`, { data: { ...BASE_TIMER, deleted: false } });
    const [patchedTimer] = await db.timer.select(timer.id);
    expect(patchedTimer.deleted).toBe(false);
});
