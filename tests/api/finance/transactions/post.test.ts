import { BASE_TRANSACTION } from "~~/test-utils/constants/finance";
import { JSONWithBigInt } from "~~/test-utils/helpers/string";
import { expect, test } from "~~/test-utils/playwright";
import {
    test401WhenLoggedOut,
    testPostSubResourceToInvalidParentResource,
} from "~~/test-utils/playwright/utils/helpers";
import {
    TRANSACTION_BAD_REQUEST_TEST_CASES,
    TRANSACTION_VALID_REQUEST_TEST_CASES,
} from "~~/test-utils/playwright/utils/helpers/finance";

const route = (id: string) => `/api/finance/accounts/${id}/transactions`;

test401WhenLoggedOut("post", route("2222222222222222"));
testPostSubResourceToInvalidParentResource(route, async (db, userId) => {
    const [account] = await db.financeAccount.insert(1, userId ? { userId } : undefined);
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    return { parentResource: account, baseData: { ...BASE_TRANSACTION, categoryId: category.id } };
});

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

        const [category] = await db.financeCategory.select();
        const { id, createdAt, deletedAt, accountId, ...rest } = (await db.financeTransaction.select())[0]!;

        expect(rest).toStrictEqual({ amount: data.amount, reference: data.reference, categoryId: category!.id });
        expect(responseData).toBe(`${route(account.id)}/${id}`);
    });
}

test("updates the account balance automatically", async ({ request, db }) => {
    let [account] = await db.financeAccount.insert(1);

    await request.post(route(account.id), { data: BASE_TRANSACTION });

    account = (await db.financeAccount.select())[0]!;
    expect(account.balance).toBe(BASE_TRANSACTION.amount);

    await request.post(route(account.id), {
        data: { ...BASE_TRANSACTION, amount: BASE_TRANSACTION.amount * -3 },
    });

    account = (await db.financeAccount.select())[0]!;
    expect(account.balance).toBe(BASE_TRANSACTION.amount * -2);
});

test("rejects creating a transaction if the resulting account balance is too large", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1, { balance: Number.MAX_SAFE_INTEGER });
    const response = await request.post(route(account.id), { data: BASE_TRANSACTION });
    expect(response.status()).toBe(409);
});

test("rejects creating a transaction if the resulting account balance is too small", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1, { balance: Number.MIN_SAFE_INTEGER });
    const response = await request.post(route(account.id), {
        data: { ...BASE_TRANSACTION, amount: -BASE_TRANSACTION.amount },
    });
    expect(response.status()).toBe(409);
});

test("automatically creates a new category when a matching one doesn't exist", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1);
    await request.post(route(account.id), {
        data: BASE_TRANSACTION,
    });
    const [category] = await db.financeCategory.select();
    expect(category!.displayName).toBe(BASE_TRANSACTION.category.name);
});

test("automatically updates a category when a matching one exists", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1);
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    expect(category.icon).not.toBe(BASE_TRANSACTION.category.icon);

    await request.post(route(account.id), {
        data: { ...BASE_TRANSACTION, category: { ...BASE_TRANSACTION.category, name: category.displayName } },
    });

    const categories = await db.financeCategory.select();
    expect(categories).toHaveLength(1);
    expect(categories[0]!.icon).toBe(BASE_TRANSACTION.category.icon);
});

test("does not alter other users' categories", async ({ request, db }) => {
    const otherUser = await db.user.selectByEmail("cmontgomeryburns@springfieldnuclear.com");
    const [myAccount] = await db.financeAccount.insert(1);
    const [otherAccount] = await db.financeAccount.insert(1, { userId: otherUser!.id });
    const [category] = await db.financeCategory.insert(1, { accountId: otherAccount.id });

    const data = { ...BASE_TRANSACTION, category: { ...BASE_TRANSACTION.category, name: category.displayName } };
    await request.post(route(myAccount.id), { data });

    const categories = await db.financeCategory.select();
    expect(categories).toHaveLength(2);
    expect(categories).toContainEqual(category);
});
