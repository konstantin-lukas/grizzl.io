import { BASE_ACCOUNT, FULL_ACCOUNT } from "~~/test-utils/constants/finance";
import { expect, test } from "~~/test-utils/playwright";
import { test401WhenLoggedOut, testIdParameter } from "~~/test-utils/playwright/utils/helpers";
import { ACCOUNT_BAD_TITLE_TEST_CASES } from "~~/test-utils/playwright/utils/helpers/finance";

const route = "/api/finance/accounts";
testIdParameter("put", route, BASE_ACCOUNT);

for (const [name, data] of ACCOUNT_BAD_TITLE_TEST_CASES) {
    test(`rejects putting an account when ${name}`, async ({ request, db }) => {
        await db.financeAccount.insert(1);
        const [timer] = await db.financeAccount.select();
        const response = await request.put(`/api/finance/accounts/${timer!.id}`, { data });
        expect(response.status()).toBe(400);
    });
}

test("returns a 204 even when the data hasn't changed", async ({ request, db }) => {
    await db.financeAccount.insert(1);
    const getResponseBefore = await request.get(route);
    const [accountBefore] = await getResponseBefore.json();
    const putResponse = await request.put(`/api/finance/accounts/${accountBefore.id}`, { data: accountBefore });
    expect(putResponse.status()).toBe(204);
    const getResponseAfter = await request.get(route);
    const [accountAfter] = await getResponseAfter.json();
    expect(accountBefore).toStrictEqual(accountAfter);
});

test("only allows putting the title", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1);
    const response = await request.put(`/api/finance/accounts/${account.id}`, {
        data: {
            ...FULL_ACCOUNT,
            deleted: true,
        },
    });
    expect(response.status()).toBe(204);
    const [putAccount] = await db.financeAccount.select(account.id);
    expect(putAccount).toStrictEqual({ ...account, title: FULL_ACCOUNT.title });
});

test401WhenLoggedOut("put", route);
