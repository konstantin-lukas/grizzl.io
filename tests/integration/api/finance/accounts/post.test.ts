import { BASE_ACCOUNT } from "~~/test-utils/constants/finance";
import { date } from "~~/test-utils/helpers/data";
import { expect, test } from "~~/test-utils/playwright";
import { test401WhenLoggedOut } from "~~/test-utils/playwright/utils/helpers";
import { ACCOUNT_BAD_REQUEST_TEST_CASES } from "~~/test-utils/playwright/utils/helpers/finance";

const route = "/api/finance/accounts";

for (const [name, data] of ACCOUNT_BAD_REQUEST_TEST_CASES) {
    test(`rejects creating an accounts when ${name}`, async ({ request }) => {
        const response = await request.post(route, { data });
        expect(response.status()).toBe(400);
    });
}

test("allows creating a new account with valid values", async ({ request, db }) => {
    const response = await request.post(route, { data: BASE_ACCOUNT });
    const apiAccount = response.headers().location;
    expect(response.status()).toBe(201);
    const accounts = await db.financeAccount.select();
    expect(accounts).toHaveLength(1);
    expect(apiAccount).toBe(`/api/finance/accounts/${accounts[0]!.id}`);
});

test("only allows setting title and currency", async ({ request, db }) => {
    const id = "2222222222222222";
    const d = date();
    await request.post(route, { data: { ...BASE_ACCOUNT, userId: id, id, createdAt: d, deletedAt: d } });
    const accounts = await db.financeAccount.select();
    const user = await db.user.selectByEmail("user@test.com");
    expect(accounts[0]!.userId).toBe(user!.id);
    expect(accounts[0]!.balance).toBe(0);
    expect(accounts[0]!.id).not.toBe(id);
    expect(accounts[0]!.createdAt).not.toBe(d);
    expect(accounts[0]!.deletedAt).not.toBe(d);
});

test401WhenLoggedOut("post", route);
