import { expect, test } from "@e2e/fixtures";

export function testIdParameter(method: "put" | "patch", apiPath: string, data?: object) {
    test("should return a 404 status code when the provided id is unknown", async ({ request }) => {
        const response = await request[method](`${apiPath}/2222222222222222`, { data });
        expect(response.status()).toBe(404);
    });

    test("should return a 400 status code when the provided id has the wrong format", async ({ request }) => {
        const response = await request[method](`${apiPath}/bananas`, { data });
        expect(response.status()).toBe(400);
    });
}
