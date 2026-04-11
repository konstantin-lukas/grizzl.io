import { expect, test } from "~~/test-utils/playwright";

test("returns a 400 error when the categoryName is not set", async ({ request }) => {
    const response = await request.get("/api/finance/category-icon");
    expect(response.status()).toBe(400);
});

test("returns the fallback icon when the category name is empty", async ({ request }) => {
    const response = await request.get("/api/finance/category-icon?categoryName");
    expect(response.status()).toBe(200);
    const receivedData = await response.json();
    expect(receivedData).toStrictEqual({ icon: "material-symbols:question-mark-rounded" });
});

test("returns the fallback icon when no fitting icon is found", async ({ request }) => {
    const response = await request.get("/api/finance/category-icon?categoryName=Germany");
    expect(response.status()).toBe(200);
    const receivedData = await response.json();
    expect(receivedData).toStrictEqual({ icon: "material-symbols:question-mark-rounded" });
});

test("returns a fitting icon suggestion", async ({ request }) => {
    const response = await request.get("/api/finance/category-icon?categoryName=Dog%20Food");
    expect(response.status()).toBe(200);
    const receivedData = await response.json();
    expect(receivedData).toStrictEqual({ icon: "material-symbols:pet-supplies-outline" });
});
