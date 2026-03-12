import { expect, test } from "~~/test-utils/playwright";
import { COMMON_TEST_CASES } from "~~/test-utils/playwright/utils/common";
import { test401WhenLoggedOut } from "~~/test-utils/playwright/utils/helpers";

for (const { route, badPostRequestTestCases, fixture, baseData, fullData, expectedPostResult } of COMMON_TEST_CASES) {
    test.describe(route, async () => {
        test401WhenLoggedOut("post", route);

        for (const [name, data] of badPostRequestTestCases) {
            test(`rejects posting when ${name}`, async ({ request }) => {
                const response = await request.post(route, { data });
                expect(response.status()).toBe(400);
            });
        }

        test("ignores any provided id for determining ownership", async ({ request, db }) => {
            await request.post(route, { data: { ...baseData, userId: "2222222222222222" } });
            const data = await db[fixture].select();
            const user = await db.user.selectByEmail("user@test.com");
            expect(data[0]!.userId).toBe(user!.id);
        });

        test("allows creating a new resource with valid values", async ({ request, db }) => {
            const response = await request.post(route, { data: baseData });
            const { location } = response.headers();
            expect(response.status()).toBe(201);
            const data = await db[fixture].select();
            expect(data).toHaveLength(1);
            expect(location).toBe(`${route}/${data[0]!.id}`);
        });

        test("only allows setting certain properties", async ({ request, db }) => {
            await request.post(route, { data: { ...fullData } });
            const user = await db.user.selectByEmail("user@test.com");
            const data = await db[fixture].select();
            expect(data[0]?.userId).toBe(user!.id);
            expect(data[0]?.id).not.toBe(fullData.id);
            expect(data[0]?.createdAt).not.toBe(fullData.createdAt);
            expect(data[0]?.deletedAt).toBe(null);
            for (const [key, value] of Object.entries(expectedPostResult)) {
                expect(data[0]![key as keyof (typeof data)[0]]).toStrictEqual(value);
            }
        });
    });
}
