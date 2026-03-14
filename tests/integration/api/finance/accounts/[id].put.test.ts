import { BASE_ACCOUNT } from "~~/test-utils/constants/finance";
import { expect, test } from "~~/test-utils/playwright";
import { test401WhenLoggedOut, testIdParameter } from "~~/test-utils/playwright/utils/helpers";
import { ACCOUNT_BAD_TITLE_TEST_CASES } from "~~/test-utils/playwright/utils/helpers/finance";

const route = "/api/finance/accounts";

testIdParameter("put", route, BASE_ACCOUNT);
test401WhenLoggedOut("put", route);

for (const [name, data] of ACCOUNT_BAD_TITLE_TEST_CASES) {
    test(`rejects updating resources when ${name}`, async ({ request, db }) => {
        await db.financeAccount.insert(1);
        const [insertedData] = await db.financeAccount.select();
        const response = await request.put(`${route}/${insertedData!.id}`, { data });
        expect(response.status()).toBe(400);
    });
}

test("returns a 204 even when the resource hasn't changed", async ({ request, db }) => {
    await db.financeAccount.insert(1);
    const getResponseBefore = await request.get(route);
    const [dataBefore] = await getResponseBefore.json();
    const putResponse = await request.put(`${route}/${dataBefore.id}`, { data: dataBefore });
    expect(putResponse.status()).toBe(204);
    const getResponseAfter = await request.get(route);
    const [dataAfter] = await getResponseAfter.json();
    expect(dataBefore).toStrictEqual(dataAfter);
});
