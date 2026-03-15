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
    test(`rejects creating resources when ${name}`, async ({ request, db }) => {
        const [account] = await db.financeAccount.insert(1);
        const response = await request.post(route(account.id), {
            data: JSONWithBigInt(data),
        });
        expect(response.status()).toBe(400);
    });
}

for (const [name, data] of TRANSACTION_VALID_REQUEST_TEST_CASES) {
    test(`allows creating resources when ${name}`, async ({ request, db }) => {
        const [account] = await db.financeAccount.insert(1);
        const response = await request.post(route(account.id), { data });
        const responseData = response.headers().location;
        expect(response.status()).toBe(201);
        const { id, createdAt, deletedAt, accountId, ...rest } = (await db.financeTransaction.select())[0]!;
        expect(rest).toStrictEqual({ ...data });
        expect(responseData).toBe(`${route(account.id)}/${id}`);
    });
}

test("updates the account balance automatically", async ({ request, db }) => {
    let [account] = await db.financeAccount.insert(1);

    await request.post(route(account.id), { data: BASE_TRANSACTION });

    account = (await db.financeAccount.select())[0]!;
    expect(account.balance).toBe(BASE_TRANSACTION.amount);

    await request.post(route(account.id), { data: { ...BASE_TRANSACTION, amount: BASE_TRANSACTION.amount * -3 } });

    account = (await db.financeAccount.select())[0]!;
    expect(account.balance).toBe(BASE_TRANSACTION.amount * -2);
});

test("rejects creating a transaction if the resulting account balance is too large", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1, { balance: Number.MAX_SAFE_INTEGER });
    await request.post(route(account.id), { data: BASE_TRANSACTION });
    expect(response.status()).toBe(400);
});

test("rejects creating a transaction if the resulting account balance is too small", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1, { balance: Number.MIN_SAFE_INTEGER });
    await request.post(route(account.id), { data: { ...BASE_TRANSACTION, amount: -BASE_TRANSACTION.amount } });
    expect(response.status()).toBe(400);
});

test("rejects creating a transaction on another user's account", async ({ request, db }) => {
    const user = await db.user.selectByEmail("cmontgomeryburns@springfieldnuclear.com");
    const [account] = await db.financeAccount.insert(1, { userId: user!.id });

    const response = await request.post(route(account.id), { data: BASE_TRANSACTION });
    expect(response.status()).toBe(403);
});

test("rejects creating a transaction on a non-existent account", async ({ request }) => {
    const response = await request.post(route("2222222222222222"), { data: BASE_TRANSACTION });
    expect(response.status()).toBe(404);
});
