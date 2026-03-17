import { BASE_TRANSACTION } from "~~/test-utils/constants/finance";
import { JSONWithBigInt } from "~~/test-utils/helpers/string";
import { expect, test } from "~~/test-utils/playwright";
import { test401WhenLoggedOut } from "~~/test-utils/playwright/utils/helpers";
import {
    TRANSACTION_BAD_REQUEST_TEST_CASES,
    TRANSACTION_VALID_REQUEST_TEST_CASES,
} from "~~/test-utils/playwright/utils/helpers/finance";

const route = (id: string) => `/api/finance/accounts/${id}/transactions`;

test401WhenLoggedOut("post", route("2222222222222222"));

for (const [name, data] of TRANSACTION_BAD_REQUEST_TEST_CASES) {
    test(`rejects updating resources when ${name}`, async ({ request, db }) => {
        const [account] = await db.financeAccount.insert(1);
        const [transaction] = await db.financeTransaction.insert(1, { accountId: account.id, amount: 0 });
        const response = await request.put(`${route(account.id)}/${transaction.id}`, {
            data: JSONWithBigInt(data),
        });
        expect(response.status()).toBe(400);
    });
}

for (const [name, data] of TRANSACTION_VALID_REQUEST_TEST_CASES) {
    test(`allows updating resources when ${name}`, async ({ request, db }) => {
        const [account] = await db.financeAccount.insert(1);
        const [transaction] = await db.financeTransaction.insert(1, { accountId: account.id, amount: 0 });
        const response = await request.put(`${route(account.id)}/${transaction.id}`, { data });
        expect(response.status()).toBe(204);
        const { id, createdAt, deletedAt, accountId, ...rest } = (await db.financeTransaction.select())[0]!;
        expect(rest).toStrictEqual({ ...data });
    });
}

test("updates the account balance automatically", async ({ request, db }) => {
    let [account] = await db.financeAccount.insert(1);
    const [transaction] = await db.financeTransaction.insert(1, { accountId: account.id, amount: 0 });

    await request.put(`${route(account.id)}/${transaction.id}`, { data: BASE_TRANSACTION });

    account = (await db.financeAccount.select())[0]!;
    expect(account.balance).toBe(BASE_TRANSACTION.amount);
});

test("rejects updating a transaction if the resulting account balance is too large", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1, { balance: 2 });
    const [transaction] = await db.financeTransaction.insert(2, { accountId: account.id, amount: 1 });
    const response = await request.put(`${route(account.id)}/${transaction.id}`, {
        data: { ...BASE_TRANSACTION, amount: Number.MAX_SAFE_INTEGER },
    });
    expect(response.status()).toBe(409);
});

test("rejects updating a transaction if the resulting account balance is too small", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1, { balance: -2 });
    const [transaction] = await db.financeTransaction.insert(2, { accountId: account.id, amount: -1 });
    const response = await request.put(`${route(account.id)}/${transaction.id}`, {
        data: { ...BASE_TRANSACTION, amount: Number.MIN_SAFE_INTEGER },
    });
    expect(response.status()).toBe(409);
});

test("rejects updating a transaction on another user's account", async ({ request, db }) => {
    const user = await db.user.selectByEmail("cmontgomeryburns@springfieldnuclear.com");
    const [account] = await db.financeAccount.insert(1, { userId: user!.id });
    const [transaction] = await db.financeTransaction.insert(1, { accountId: account.id });

    const response = await request.put(`${route(account.id)}/${transaction.id}`, { data: BASE_TRANSACTION });
    expect(response.status()).toBe(404);
});

test("rejects updating a transaction on a non-existent account", async ({ request }) => {
    const response = await request.put(route("2222222222222222"), { data: BASE_TRANSACTION });
    expect(response.status()).toBe(404);
});
