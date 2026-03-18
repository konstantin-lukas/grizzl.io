import { generateFilterCombinations } from "~~/test-utils/helpers/object";
import { sortByCreatedAt } from "~~/test-utils/helpers/sort";
import { expect, test } from "~~/test-utils/playwright";
import {
    test401WhenLoggedOut,
    testGetCollectionOwnership,
    testGetEmptyCollection,
    testGetSoftDeletedCollection,
} from "~~/test-utils/playwright/utils/helpers";

const route = (id: string) => `/api/finance/accounts/${id}/transactions`;

test401WhenLoggedOut("get", route("2222222222222222"));
testGetEmptyCollection(async db => route((await db.financeAccount.insert(1))[0].id));
testGetCollectionOwnership(async (db, userId) => {
    const [account] = await db.financeAccount.insert(1, { userId });
    await db.financeTransaction.insert(1, { accountId: account.id });
    return route(account.id);
});
testGetSoftDeletedCollection(async db => {
    const [account] = await db.financeAccount.insert(1);
    await db.financeTransaction.insert(1, { accountId: account.id, deletedAt: new Date() });
    return route(account.id);
});

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

const filters = generateFilterCombinations([
    { from: "2024-07-24T12:00:00Z" },
    { to: "2025-03-25T12:00:00Z" },
    { reference: "labore" },
    { category: "pets" },
]);

for (const filter of filters) {
    test(`allows retrieving a list of resources filtered by ${Object.keys(filter)}`, async ({ request, db }) => {
        const [account] = await db.financeAccount.insert(1);
        const data = (await db.financeTransaction.insert(50, { accountId: account.id })).map(
            ({ createdAt, deletedAt, accountId, ...rest }) => ({
                ...rest,
                createdAt: createdAt.toISOString(),
            }),
        );
        sortByCreatedAt(data, "desc");
        const queryParams = `?${Object.entries(filter)
            .map(([key, value]) => `${key}=${value}`)
            .join("&")}`;

        const response = await request.get(route(account.id) + queryParams);
        expect(response.status()).toBe(200);
        const receivedData = await response.json();

        let remainingData = data;
        if ("from" in filter) {
            remainingData = remainingData.filter(
                datum => new Date(datum.createdAt).getTime() >= new Date(filter.from!).getTime(),
            );
        }
        if ("to" in filter) {
            remainingData = remainingData.filter(
                datum => new Date(datum.createdAt).getTime() <= new Date(filter.to!).getTime(),
            );
        }
        if ("reference" in filter) {
            remainingData = remainingData.filter(datum => datum.reference?.includes(filter.reference!));
        }
        if ("category" in filter) {
            remainingData = remainingData.filter(datum => datum.category === filter.category);
        }

        expect(receivedData).not.toHaveLength(0);
        expect(receivedData).toStrictEqual(remainingData);
    });
}

test("allows searching for substrings without wildcard operators", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1);
    await db.financeTransaction.insert(1, { accountId: account.id, reference: "ABC%123_XYZ" });
    await db.financeTransaction.insert(1, { accountId: account.id, reference: "123" });

    const search = ["%", "_", "ABC"];
    for (const s of search) {
        const response = await request.get(`${route(account.id)}?reference=${s}`);
        const receivedData = await response.json();
        expect(receivedData).toHaveLength(1);
    }

    const response = await request.get(`${route(account.id)}?reference=123`);
    const receivedData = await response.json();
    expect(receivedData).toHaveLength(2);
});

test("does not return transactions of soft-deleted accounts", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1, { deletedAt: new Date() });
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
    sortByCreatedAt(transactions, "desc");
    const response1 = await request.get(route(accounts[0].id));
    const response2 = await request.get(route(accounts[1].id));
    expect(response1.status()).toBe(200);
    expect(response2.status()).toBe(200);
    expect(await response1.json()).toStrictEqual(transactions);
    expect(await response2.json()).toStrictEqual([]);
});
