import type { DBFixtures } from "~~/test-utils/database/fixture";
import { expect, test } from "~~/test-utils/playwright";
import { COMMON_TEST_CASES } from "~~/test-utils/playwright/utils/common";
import { test401WhenLoggedOut, testIdParameter } from "~~/test-utils/playwright/utils/helpers";

for (const {
    route,
    fixture,
    expectedPutChanges,
    fullData,
    badPutRequestTestCases,
    baseData,
    insertFunction,
} of COMMON_TEST_CASES) {
    test.describe(route, async () => {
        testIdParameter("put", route, baseData);
        test401WhenLoggedOut("put", route);

        const createData = async (db: DBFixtures) => {
            if (insertFunction) {
                await insertFunction(db);
            } else {
                await db[fixture].insert(1);
            }
        };

        test("returns a 204 even when the data hasn't changed", async ({ request, db }) => {
            await createData(db);
            const getResponseBefore = await request.get(route);
            const [dataBefore] = await getResponseBefore.json();
            const putResponse = await request.put(`${route}/${dataBefore.id}`, { data: dataBefore });
            expect(putResponse.status()).toBe(204);
            const getResponseAfter = await request.get(route);
            const [dataAfter] = await getResponseAfter.json();
            expect(dataBefore).toStrictEqual(dataAfter);
        });

        for (const [name, data] of badPutRequestTestCases) {
            test(`rejects putting when ${name}`, async ({ request, db }) => {
                await createData(db);
                const [row] = await db[fixture].select();
                const response = await request.put(`${route}/${row!.id}`, { data });
                expect(response.status()).toBe(400);
            });
        }

        test("only allows putting certain fields", async ({ request, db }) => {
            const [insertedRow] = await db[fixture].insert(1);
            const response = await request.put(`${route}/${insertedRow.id}`, {
                data: fullData,
            });
            expect(response.status()).toBe(204);
            const data = await db[fixture].select(insertedRow.id);
            for (const [key, value] of Object.entries({ ...data[0], ...expectedPutChanges })) {
                expect(data[0]![key as keyof (typeof data)[0]]).toStrictEqual(value);
            }
        });
    });
}
