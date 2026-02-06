import { expect, test } from "~~/test-utils/playwright";
import { withoutAuth } from "~~/test-utils/playwright/utils/auth";

const TYPES = [
    ["string", "42"],
    ["int", 42],
    ["float", 42.5],
    ["boolean", true],
    ["null", null],
    ["object", {}],
    ["array", []],
] as const;

export function testIdParameter(method: "put" | "patch", apiPath: string, data?: object) {
    test("returns a 404 status code when the provided id is unknown", async ({ request }) => {
        const response = await request[method](`${apiPath}/2222222222222222`, { data });
        expect(response.status()).toBe(404);
    });

    test("returns a 400 status code when the provided id has the wrong format", async ({ request }) => {
        const response = await request[method](`${apiPath}/bananas`, { data });
        expect(response.status()).toBe(400);
    });
}

export function test401WhenLoggedOut(method: "get" | "post" | "patch" | "delete" | "put", path: string) {
    withoutAuth(() => {
        test("returns a 401 status code when an unauthenticated request is made", async ({ request }) => {
            const response = await request[method](path);
            expect(response.status()).toBe(401);
        });
    });
}

export function createInvalidTypeTestCases<T extends Record<string, unknown>>(
    data: T,
    property: keyof T,
    options: {
        valid?: (typeof TYPES)[number][0][];
        caseName?: (property: string, type: string) => string;
        dataTransform?: (data: T, property: string, value: (typeof TYPES)[number][1]) => unknown;
    },
) {
    const testCases = [];
    for (const [type, value] of TYPES) {
        if (!(options.valid ?? []).includes(type)) {
            testCases.push([
                options.caseName?.(property as string, type) ?? `property ${property as string} is a ${type}`,
                options.dataTransform?.(data, property as string, value) ?? { ...data, [property]: value },
            ]);
        }
    }
    return testCases;
}
