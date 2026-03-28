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
    const [category] = await db.financeCategory.insert(1, { accountId: account1.id });
    const transactions = await db.financeTransaction.insert(2, {
        accountId: account1.id,
        categoryId: category.id,
    });
    const subResources = transactions.map(({ categoryId: _, ...transaction }) => ({
        ...transaction,
        category: { name: category.displayName, icon: category.icon, id: category.id },
    }));
    return {
        subResources,
        thisRoute: route(account1.id),
        otherRoute: route(account2.id),
    };
});
testGetCollectionSortedByCreationDate(async db => {
    const [account] = await db.financeAccount.insert(1);
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    const transactions = await db.financeTransaction.insert(3, { accountId: account.id, categoryId: category.id });
    const resources = transactions.map(({ categoryId: _, ...transaction }) => ({
        ...transaction,
        category: { name: category.displayName, icon: category.icon, id: category.id },
    }));
    return { resources, route: route(account.id) };
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
    { category: true },
]);

for (const filter of filters) {
    test(`allows retrieving a list of resources filtered by ${Object.keys(filter)}`, async ({ request, db }) => {
        const [account] = await db.financeAccount.insert(1);
        const categories = await db.financeCategory.insert(5, { accountId: account.id });
        const data = (
            await db.financeTransaction.insert(50, index => ({
                accountId: account.id,
                categoryId: categories[index % categories.length]!.id,
            }))
        ).map(({ createdAt, deletedAt, accountId, ...rest }) => ({
            ...rest,
            createdAt: createdAt.toISOString(),
        }));
        sortByCreatedAt(data, "desc");
        const categoryId = filter.category ? categories[0].id : undefined;
        const queryParams = `?${Object.entries(filter)
            .map(
                ([key, value]) =>
                    `${key === "category" ? "categoryId" : key}=${key === "category" ? categoryId : value}`,
            )
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
            remainingData = remainingData.filter(datum => datum.categoryId === categoryId);
        }

        expect(receivedData).not.toHaveLength(0);
        expect(receivedData).toStrictEqual(
            remainingData.map(({ categoryId, ...rest }) => {
                const category = categories.find(category => category.id === categoryId)!;
                return { ...rest, category: { id: category.id, name: category.displayName, icon: category.icon } };
            }),
        );
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
