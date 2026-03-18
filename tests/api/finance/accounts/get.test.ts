import { sortByCreatedAt } from "~~/test-utils/helpers/sort";
import { expect, test } from "~~/test-utils/playwright";
import {
    test401WhenLoggedOut,
    testGetCollectionOwnership,
    testGetEmptyCollection,
    testGetSoftDeletedCollection,
} from "~~/test-utils/playwright/utils/helpers";

const route = "/api/finance/accounts";

test401WhenLoggedOut("get", route);
testGetEmptyCollection(route);
testGetCollectionOwnership(async (db, userId) => {
    await db.financeAccount.insert(1, { userId });
    return route;
});
testGetSoftDeletedCollection(async db => {
    await db.financeAccount.insert(1, { deletedAt: new Date() });
    return route;
});

test("allows retrieving a list of resources sorted by creation date", async ({ request, db }) => {
    const data = (await db.financeAccount.insert(1)).map(({ createdAt, userId, deletedAt, ...rest }) => ({
        ...rest,
        createdAt: createdAt.toISOString(),
    }));
    sortByCreatedAt(data, "desc");
    const response = await request.get(route);
    expect(response.status()).toBe(200);
    expect(await response.json()).toStrictEqual(data);
});
