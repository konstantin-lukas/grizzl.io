import { BASE_AUTO_TRANSACTION } from "~~/test-utils/constants/finance";
import { JSONWithBigInt } from "~~/test-utils/helpers/string";
import { expect, test } from "~~/test-utils/playwright";
import { test401WhenLoggedOut } from "~~/test-utils/playwright/utils/helpers";
import {
    AUTO_TRANSACTION_BAD_REQUEST_TEST_CASES,
    AUTO_TRANSACTION_VALID_REQUEST_TEST_CASES,
} from "~~/test-utils/playwright/utils/helpers/finance";

const route = (id: string) => `/api/finance/accounts/${id}/auto-transactions`;

test401WhenLoggedOut("post", route("2222222222222222"));

test("rejects updating a sub-resource on another user's parent resource", async ({ request, db }) => {
    const user = await db.user.selectByEmail("cmontgomeryburns@springfieldnuclear.com");
    const [account] = await db.financeAccount.insert(1, { userId: user!.id });
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    const [autoTransaction] = await db.financeAutoTransaction.insert(1, {
        accountId: account.id,
        categoryId: category.id,
    });

    const response = await request.put(`${route(account.id)}/${autoTransaction.id}`, {
        data: { ...BASE_AUTO_TRANSACTION, categoryId: category.id },
    });
    expect(response.status()).toBe(400);
});

test("rejects updating a sub-resource when the parent resource is not associated", async ({ request, db }) => {
    const [account1, account2] = await db.financeAccount.insert(2);
    const [category1] = await db.financeCategory.insert(1, { accountId: account1.id });
    const [category2] = await db.financeCategory.insert(1, { accountId: account2.id });
    const [autoTransaction] = await db.financeAutoTransaction.insert(1, {
        accountId: account1.id,
        categoryId: category1.id,
    });

    const response = await request.put(`${route(account2.id)}/${autoTransaction.id}`, {
        data: { ...BASE_AUTO_TRANSACTION, categoryId: category2.id },
    });
    expect(response.status()).toBe(404);
});

test("rejects updating a sub-resource on a non-existent parent resource", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1);
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    const [autoTransaction] = await db.financeAutoTransaction.insert(1, {
        accountId: account.id,
        categoryId: category.id,
    });
    const response = await request.put(`${route("2222222222222222")}/${autoTransaction.id}`, {
        data: { ...BASE_AUTO_TRANSACTION, categoryId: category.id },
    });
    expect(response.status()).toBe(400);
});

for (const [name, data] of AUTO_TRANSACTION_BAD_REQUEST_TEST_CASES) {
    test(`rejects updating resources when ${name}`, async ({ request, db }) => {
        const [account] = await db.financeAccount.insert(1);
        const [category] = await db.financeCategory.insert(1, { accountId: account.id });
        const [transaction] = await db.financeAutoTransaction.insert(1, {
            accountId: account.id,
            categoryId: category.id,
        });
        const payload =
            (data as { categoryId: string }).categoryId === BASE_AUTO_TRANSACTION.categoryId
                ? { ...data, categoryId: category.id }
                : data;
        const response = await request.put(`${route(account.id)}/${transaction.id}`, {
            data: JSONWithBigInt(payload),
        });
        expect(response.status()).toBe(400);
    });
}

for (const [name, data] of AUTO_TRANSACTION_VALID_REQUEST_TEST_CASES) {
    test(`allows updating resources when ${name}`, async ({ request, db }) => {
        const [account] = await db.financeAccount.insert(1);
        const [category] = await db.financeCategory.insert(1, { accountId: account.id });
        const [transaction] = await db.financeAutoTransaction.insert(1, {
            accountId: account.id,
            categoryId: category.id,
        });
        const payload =
            data.categoryId === BASE_AUTO_TRANSACTION.categoryId ? { ...data, categoryId: category.id } : data;
        const response = await request.put(`${route(account.id)}/${transaction.id}`, {
            data: payload,
        });
        expect(response.status()).toBe(204);
        const { id, createdAt, deletedAt, accountId, ...rest } = (await db.financeAutoTransaction.select())[0]!;
        expect(rest).toStrictEqual({ ...data, categoryId: category.id });
    });
}

test("rejects attaching a category belonging to a different account", async ({ request, db }) => {
    const [account1, account2] = await db.financeAccount.insert(2);
    const [category1] = await db.financeCategory.insert(1, { accountId: account1.id });
    const [category2] = await db.financeCategory.insert(1, { accountId: account2.id });
    const [autoTransaction] = await db.financeAutoTransaction.insert(1, {
        accountId: account1.id,
        categoryId: category1.id,
    });

    const response = await request.put(`${route(account1.id)}/${autoTransaction.id}`, {
        data: { ...BASE_AUTO_TRANSACTION, categoryId: category2.id },
    });
    expect(response.status()).toBe(400);
});
