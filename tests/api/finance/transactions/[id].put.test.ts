import { BASE_TRANSACTION } from "~~/test-utils/constants/finance";
import { JSONWithBigInt } from "~~/test-utils/helpers/string";
import { expect, test } from "~~/test-utils/playwright";
import {
    test401WhenLoggedOut,
    testPutSubResourceOnInvalidParentResource,
} from "~~/test-utils/playwright/utils/helpers";
import {
    TRANSACTION_BAD_REQUEST_TEST_CASES,
    TRANSACTION_VALID_REQUEST_TEST_CASES,
} from "~~/test-utils/playwright/utils/helpers/finance";

const route = (id: string) => `/api/finance/accounts/${id}/transactions`;

test401WhenLoggedOut("post", route("2222222222222222"));
testPutSubResourceOnInvalidParentResource(async (db, userId) => {
    const [account1, account2] = await db.financeAccount.insert(2, userId ? { userId } : undefined);
    const [category] = await db.financeCategory.insert(1, { accountId: account1.id });
    const [transaction] = await db.financeTransaction.insert(1, { accountId: account1.id, categoryId: category.id });
    return {
        validUrl: `${route(account1.id)}/${transaction.id}`,
        invalidUrl: `${route(account2.id)}/${transaction.id}`,
        unknownUrl: `${route("2222222222222222")}/${transaction.id}`,
    };
}, BASE_TRANSACTION);

for (const [name, data] of TRANSACTION_BAD_REQUEST_TEST_CASES) {
    test(`rejects updating resources when ${name}`, async ({ request, db }) => {
        const [account] = await db.financeAccount.insert(1);
        const [category] = await db.financeCategory.insert(1, { accountId: account.id });
        const [transaction] = await db.financeTransaction.insert(1, {
            accountId: account.id,
            categoryId: category.id,
            amount: 0,
        });
        const response = await request.put(`${route(account.id)}/${transaction.id}`, {
            data: JSONWithBigInt(data),
        });
        expect(response.status()).toBe(400);
    });
}

for (const [name, data] of TRANSACTION_VALID_REQUEST_TEST_CASES) {
    test(`allows updating resources when ${name}`, async ({ request, db }) => {
        const [account] = await db.financeAccount.insert(1);
        const [category] = await db.financeCategory.insert(1, { accountId: account.id });
        const [transaction] = await db.financeTransaction.insert(1, {
            accountId: account.id,
            categoryId: category.id,
            amount: 0,
        });
        const response = await request.put(`${route(account.id)}/${transaction.id}`, { data });
        expect(response.status()).toBe(204);
        const { id, createdAt, deletedAt, accountId, ...rest } = (await db.financeTransaction.select())[0]!;
        expect(rest).toStrictEqual({ ...data });
    });
}

test("updates the account balance automatically", async ({ request, db }) => {
    let [account] = await db.financeAccount.insert(1);
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    const [transaction] = await db.financeTransaction.insert(1, {
        accountId: account.id,
        categoryId: category.id,
        amount: 0,
    });

    await request.put(`${route(account.id)}/${transaction.id}`, { data: BASE_TRANSACTION });

    account = (await db.financeAccount.select())[0]!;
    expect(account.balance).toBe(BASE_TRANSACTION.amount);
});

test("rejects updating a transaction if the resulting account balance is too large", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1, { balance: 2 });
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    const [transaction] = await db.financeTransaction.insert(2, {
        accountId: account.id,
        categoryId: category.id,
        amount: 1,
    });
    const response = await request.put(`${route(account.id)}/${transaction.id}`, {
        data: { ...BASE_TRANSACTION, amount: Number.MAX_SAFE_INTEGER },
    });
    expect(response.status()).toBe(409);
});

test("rejects updating a transaction if the resulting account balance is too small", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1, { balance: -2 });
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    const [transaction] = await db.financeTransaction.insert(2, {
        accountId: account.id,
        categoryId: category.id,
        amount: -1,
    });
    const response = await request.put(`${route(account.id)}/${transaction.id}`, {
        data: { ...BASE_TRANSACTION, amount: Number.MIN_SAFE_INTEGER },
    });
    expect(response.status()).toBe(409);
});
