import { BASE_AUTO_TRANSACTION } from "~~/test-utils/constants/finance";
import { JSONWithBigInt } from "~~/test-utils/helpers/string";
import { expect, test } from "~~/test-utils/playwright";
import {
    test401WhenLoggedOut,
    testPostSubResourceToInvalidParentResource,
} from "~~/test-utils/playwright/utils/helpers";
import {
    AUTO_TRANSACTION_BAD_REQUEST_TEST_CASES,
    AUTO_TRANSACTION_VALID_REQUEST_TEST_CASES,
} from "~~/test-utils/playwright/utils/helpers/finance";

const route = (id: string) => `/api/finance/accounts/${id}/auto-transactions`;

test401WhenLoggedOut("post", route("2222222222222222"));
testPostSubResourceToInvalidParentResource(route, async (db, userId) => {
    const [account] = await db.financeAccount.insert(1, userId ? { userId } : undefined);
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    return { parentResource: account, baseData: { ...BASE_AUTO_TRANSACTION, categoryId: category.id } };
});

for (const [name, data] of AUTO_TRANSACTION_BAD_REQUEST_TEST_CASES) {
    test(`rejects creating resources when ${name}`, async ({ request, db }) => {
        const [account] = await db.financeAccount.insert(1);
        const [category] = await db.financeCategory.insert(1, { accountId: account.id });
        const payload =
            (data as { categoryId: string }).categoryId === BASE_AUTO_TRANSACTION.categoryId
                ? { ...data, categoryId: category.id }
                : data;
        const response = await request.post(route(account.id), {
            data: JSONWithBigInt(payload),
        });
        expect(response.status()).toBe(400);
    });
}

for (const [name, data] of AUTO_TRANSACTION_VALID_REQUEST_TEST_CASES) {
    test(`allows creating resources when ${name}`, async ({ request, db }) => {
        const [account] = await db.financeAccount.insert(1);
        const [category] = await db.financeCategory.insert(1, { accountId: account.id });
        const payload =
            data.categoryId === BASE_AUTO_TRANSACTION.categoryId ? { ...data, categoryId: category.id } : data;
        const response = await request.post(route(account.id), { data: payload });
        const responseData = response.headers().location;
        expect(response.status()).toBe(201);
        const { id, createdAt, deletedAt, accountId, ...rest } = (await db.financeAutoTransaction.select())[0]!;
        expect(rest).toStrictEqual({ ...data, categoryId: category.id });
        expect(responseData).toBe(`${route(account.id)}/${id}`);
    });
}

test("rejects attaching a category belonging to a different account", async ({ request, db }) => {
    const [account1, account2] = await db.financeAccount.insert(2);
    const [category] = await db.financeCategory.insert(1, { accountId: account2.id });

    const response = await request.post(route(account1.id), {
        data: { ...BASE_AUTO_TRANSACTION, categoryId: category.id },
    });
    expect(response.status()).toBe(400);
});
