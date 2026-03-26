import { generateFilterCombinations } from "~~/test-utils/helpers/object";
import { sortByCreatedAt } from "~~/test-utils/helpers/sort";
import { expect, test } from "~~/test-utils/playwright";
import {
    test401WhenLoggedOut,
    testGetCollectionOfSoftDeletedParentResource,
    testGetCollectionOwnership,
    testGetCollectionSortedByCreationDate,
    testGetCollectionSubResourceFiltering,
    testGetEmptyCollection,
    testGetSoftDeletedCollection,
} from "~~/test-utils/playwright/utils/helpers";

const route = (id: string) => `/api/finance/accounts/${id}/transactions`;

test401WhenLoggedOut("get", route("2222222222222222"));
testGetEmptyCollection(async db => route((await db.financeAccount.insert(1))[0].id));
testGetCollectionOwnership(async (db, userId) => {
    const [account] = await db.financeAccount.insert(1, { userId });
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    await db.financeTransaction.insert(1, { accountId: account.id, categoryId: category.id });
    return route(account.id);
});
testGetSoftDeletedCollection(async db => {
    const [account] = await db.financeAccount.insert(1);
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    await db.financeTransaction.insert(1, { accountId: account.id, categoryId: category.id, deletedAt: new Date() });
    return route(account.id);
});
testGetCollectionSubResourceFiltering(async db => {
    const [account1, account2] = await db.financeAccount.insert(2);
    const [category1] = await db.financeCategory.insert(1, { accountId: account1.id });
    const [category2] = await db.financeCategory.insert(1, { accountId: account2.id });
    const transaction1 = await db.financeTransaction.insert(1, { accountId: account1.id, categoryId: category1.id });
    const transaction2 = await db.financeTransaction.insert(1, { accountId: account2.id, categoryId: category2.id });

    return {
        subResources: [transaction1, transaction2],
        thisRoute: route(account1.id),
        otherRoute: route(account2.id),
    };
});
testGetCollectionSortedByCreationDate(async db => {
    const [account] = await db.financeAccount.insert(1);
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    const transactions = await db.financeTransaction.insert(3, { accountId: account.id, categoryId: category.id });
    return { resources: transactions, route: route(account.id) };
});
testGetCollectionOfSoftDeletedParentResource(async db => {
    const [account] = await db.financeAccount.insert(1, { deletedAt: new Date() });
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    await db.financeTransaction.insert(1, { accountId: account.id, categoryId: category.id });
    return route(account.id);
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
        const [category] = await db.financeCategory.insert(1, { accountId: account.id });
        const data = (await db.financeTransaction.insert(50, { accountId: account.id, categoryId: category.id })).map(
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
            remainingData = remainingData.filter(datum => datum.categoryId === filter.category);
        }

        expect(receivedData).not.toHaveLength(0);
        expect(receivedData).toStrictEqual(remainingData);
    });
}

test("allows searching for substrings without wildcard operators", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1);
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    await db.financeTransaction.insert(1, { accountId: account.id, categoryId: category.id, reference: "ABC%123_XYZ" });
    await db.financeTransaction.insert(1, { accountId: account.id, categoryId: category.id, reference: "123" });

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
