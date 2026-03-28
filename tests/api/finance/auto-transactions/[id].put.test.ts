import { BASE_AUTO_TRANSACTION } from "~~/test-utils/constants/finance";
import { JSONWithBigInt } from "~~/test-utils/helpers/string";
import { expect, test } from "~~/test-utils/playwright";
import { test401WhenLoggedOut } from "~~/test-utils/playwright/utils/helpers";
import {
    AUTO_TRANSACTION_BAD_REQUEST_TEST_CASES,
    AUTO_TRANSACTION_VALID_REQUEST_TEST_CASES,
} from "~~/test-utils/playwright/utils/helpers/finance";

const route = (id: string) => `/api/finance/accounts/${id}/auto-transactions`;

test401WhenLoggedOut("put", route("2222222222222222"));

test("rejects updating a sub-resource on another user's parent resource", async ({ request, db }) => {
    const user = await db.user.selectByEmail("cmontgomeryburns@springfieldnuclear.com");
    const [account] = await db.financeAccount.insert(1, { userId: user!.id });
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    const [autoTransaction] = await db.financeAutoTransaction.insert(1, {
        accountId: account.id,
        categoryId: category.id,
    });

    const response = await request.put(`${route(account.id)}/${autoTransaction.id}`, {
        data: BASE_AUTO_TRANSACTION,
    });
    expect(response.status()).toBe(404);
});

test("rejects updating a sub-resource when the parent resource is not associated", async ({ request, db }) => {
    const [account1, account2] = await db.financeAccount.insert(2);
    const [category1] = await db.financeCategory.insert(1, { accountId: account1.id });
    const [autoTransaction] = await db.financeAutoTransaction.insert(1, {
        accountId: account1.id,
        categoryId: category1.id,
    });

    const response = await request.put(`${route(account2.id)}/${autoTransaction.id}`, {
        data: BASE_AUTO_TRANSACTION,
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
        data: BASE_AUTO_TRANSACTION,
    });
    expect(response.status()).toBe(404);
});

for (const [name, data] of AUTO_TRANSACTION_BAD_REQUEST_TEST_CASES) {
    test(`rejects updating resources when ${name}`, async ({ request, db }) => {
        const [account] = await db.financeAccount.insert(1);
        const [category] = await db.financeCategory.insert(1, { accountId: account.id });
        const [transaction] = await db.financeAutoTransaction.insert(1, {
            accountId: account.id,
            categoryId: category.id,
        });
        const response = await request.put(`${route(account.id)}/${transaction.id}`, {
            data: JSONWithBigInt(data),
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
        const response = await request.put(`${route(account.id)}/${transaction.id}`, {
            data: { ...data, category: { name: category.displayName, icon: category.icon } },
        });
        expect(response.status()).toBe(204);
        const { id, createdAt, deletedAt, accountId, ...rest } = (await db.financeAutoTransaction.select())[0]!;
        const { category: _, ...expectedData } = data;
        expect(rest).toStrictEqual({ ...expectedData, categoryId: category.id });
    });
}

test("automatically creates a new category when a matching one doesn't exist", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1);
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    const [transaction] = await db.financeAutoTransaction.insert(1, { accountId: account.id, categoryId: category.id });
    await request.put(`${route(account.id)}/${transaction.id}`, { data: BASE_AUTO_TRANSACTION });
    const categories = await db.financeCategory.select();
    expect(categories).toHaveLength(2);
    expect(categories).toContainEqual(
        expect.objectContaining({
            icon: BASE_AUTO_TRANSACTION.category.icon,
            displayName: BASE_AUTO_TRANSACTION.category.name,
        }),
    );
});

test("automatically updates a category when a matching one exists", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1);
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    const [transaction] = await db.financeAutoTransaction.insert(1, { accountId: account.id, categoryId: category.id });
    expect(category.icon).not.toBe(BASE_AUTO_TRANSACTION.category.icon);

    await request.put(`${route(account.id)}/${transaction.id}`, {
        data: { ...BASE_AUTO_TRANSACTION, category: { ...BASE_AUTO_TRANSACTION.category, name: category.displayName } },
    });

    const categories = await db.financeCategory.select();
    expect(categories).toHaveLength(1);
    expect(categories[0]!.icon).toBe(BASE_AUTO_TRANSACTION.category.icon);
});

test("does not alter other users' categories", async ({ request, db }) => {
    const otherUser = await db.user.selectByEmail("cmontgomeryburns@springfieldnuclear.com");
    const [myAccount] = await db.financeAccount.insert(1);
    const [otherAccount] = await db.financeAccount.insert(1, { userId: otherUser!.id });
    const [myCategory, otherCategory] = await db.financeCategory.insert(2, i => ({
        accountId: i === 0 ? myAccount.id : otherAccount.id,
    }));
    const [myTransaction] = await db.financeAutoTransaction.insert(1, {
        accountId: myAccount.id,
        categoryId: myCategory.id,
    });

    const data = {
        ...BASE_AUTO_TRANSACTION,
        category: { ...BASE_AUTO_TRANSACTION.category, name: otherCategory.displayName },
    };
    await request.put(`${route(myAccount.id)}/${myTransaction.id}`, { data });

    const categories = await db.financeCategory.select();
    expect(categories).toHaveLength(3);
    expect(categories).toContainEqual(otherCategory);
});
