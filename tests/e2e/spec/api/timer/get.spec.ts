import { expect, test } from "@e2e/fixtures";

test("should allow retrieving a list of timers", async ({ request }) => {
    const response = await request.get("/api/timers");
    expect(response.status()).toBe(200);
});
