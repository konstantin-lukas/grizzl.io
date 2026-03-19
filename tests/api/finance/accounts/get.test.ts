import {
    test401WhenLoggedOut,
    testGetCollectionOwnership,
    testGetCollectionSortedByCreationDate,
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
testGetCollectionSortedByCreationDate(async db => {
    const accounts = await db.financeAccount.insert(1);
    return { resources: accounts, route };
});
