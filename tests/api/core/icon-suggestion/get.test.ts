import { expect, test } from "~~/test-utils/playwright";

test("returns a 400 error when the categoryName is not set", async ({ request }) => {
    const response = await request.get("/api/icon-suggestion");
    expect(response.status()).toBe(400);
});

test("returns the fallback icon when the category name is empty", async ({ request }) => {
    const response = await request.get("/api/icon-suggestion?categoryName");
    expect(response.status()).toBe(200);
    const receivedData = await response.json();
    expect(receivedData).toStrictEqual({ icon: "question-mark-rounded" });
});

test("returns the fallback icon when no fitting icon is found", async ({ request }) => {
    const response = await request.get("/api/icon-suggestion?categoryName=Germany");
    expect(response.status()).toBe(200);
    const receivedData = await response.json();
    expect(receivedData).toStrictEqual({ icon: "question-mark-rounded" });
});

test("returns a fitting icon suggestion", async ({ request }) => {
    const response = await request.get("/api/icon-suggestion?categoryName=Dog%20Food");
    expect(response.status()).toBe(200);
    const receivedData = await response.json();
    expect(receivedData).toStrictEqual({ icon: "pet-supplies-outline" });
});
