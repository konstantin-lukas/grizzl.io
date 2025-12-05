import { expect, test } from "@e2e/fixtures";

test("should allow retrieving a list of timers", async ({ request, db }) => {
    await db.timer.reset();
    await db.timer.insert();
    const response = await request.get("/api/timers");
    expect(response.status()).toBe(200);
});
