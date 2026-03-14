import { sortByCreatedAt } from "~~/test-utils/helpers/sort";
import { expect, test } from "~~/test-utils/playwright";
import { test401WhenLoggedOut } from "~~/test-utils/playwright/utils/helpers";

const route = (id: string) => `/api/finance/accounts/${id}/transactions`;

test401WhenLoggedOut("get", route("2222222222222222"));

test("allows retrieving a list of resources sorted by creation date", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1);
    const data = (await db.financeTransaction.insert(3, { accountId: account.id })).map(
        ({ createdAt, deletedAt, accountId, ...rest }) => ({
            ...rest,
            createdAt: createdAt.toISOString(),
        }),
    );
    sortByCreatedAt(data, "desc");
    const response = await request.get(route(account.id));
    expect(response.status()).toBe(200);
    expect(await response.json()).toStrictEqual(data);
});

test("returns an empty array when there are no resources", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1);
    const response = await request.get(route(account.id));
    expect(response.status()).toBe(200);
    expect(await response.json()).toStrictEqual([]);
});

test("does not return soft-deleted resources", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1);
    await db.financeTransaction.insert(1, { accountId: account.id, deletedAt: new Date() });
    const response = await request.get(route(account.id));
    expect(response.status()).toBe(200);
    expect(await response.json()).toStrictEqual([]);
});

test("does not return transactions of soft-deleted accounts", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1, { deletedAt: new Date() });
    await db.financeTransaction.insert(1, { accountId: account.id });
    const response = await request.get(route(account.id));
    expect(response.status()).toBe(200);
    expect(await response.json()).toStrictEqual([]);
});

test("does not return transactions of accounts belonging to other users", async ({ request, db }) => {
    const user = await db.user.selectByEmail("cmontgomeryburns@springfieldnuclear.com");
    const [account] = await db.financeAccount.insert(1, { userId: user!.id });
    await db.financeTransaction.insert(1, { accountId: account.id });
    const response = await request.get(route(account.id));
    expect(response.status()).toBe(200);
    expect(await response.json()).toStrictEqual([]);
});

test("does not return transactions of other accounts", async ({ request, db }) => {
    const accounts = await db.financeAccount.insert(2);
    const transactions = (await db.financeTransaction.insert(2, { accountId: accounts[0].id })).map(
        ({ accountId, createdAt, deletedAt, ...rest }) => ({
            ...rest,
            createdAt: createdAt.toISOString(),
        }),
    );
    const response1 = await request.get(route(accounts[0].id));
    const response2 = await request.get(route(accounts[1].id));
    expect(response1.status()).toBe(200);
    expect(response2.status()).toBe(200);
    expect(await response1.json()).toStrictEqual(transactions);
    expect(await response2.json()).toStrictEqual([]);
});
