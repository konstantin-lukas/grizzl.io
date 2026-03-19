import {
    test401WhenLoggedOut,
    testGetCollectionOfSoftDeletedParentResource,
    testGetCollectionOwnership,
    testGetCollectionSortedByCreationDate,
    testGetCollectionSubResourceFiltering,
    testGetEmptyCollection,
    testGetSoftDeletedCollection,
} from "~~/test-utils/playwright/utils/helpers";

const route = (id: string) => `/api/finance/accounts/${id}/auto-transactions`;

test401WhenLoggedOut("get", route("2222222222222222"));
testGetEmptyCollection(async db => route((await db.financeAccount.insert(1))[0].id));
testGetCollectionOwnership(async (db, userId) => {
    const [account] = await db.financeAccount.insert(1, { userId });
    await db.financeAutoTransaction.insert(1, { accountId: account.id });
    return route(account.id);
});
testGetSoftDeletedCollection(async db => {
    const [account] = await db.financeAccount.insert(1);
    await db.financeAutoTransaction.insert(1, { accountId: account.id, deletedAt: new Date() });
    return route(account.id);
});
testGetCollectionSubResourceFiltering(async db => {
    const accounts = await db.financeAccount.insert(2);
    const transactions = await db.financeAutoTransaction.insert(2, { accountId: accounts[0].id });
    return { subResources: transactions, thisRoute: route(accounts[0].id), otherRoute: route(accounts[1].id) };
});
testGetCollectionSortedByCreationDate(async db => {
    const [account] = await db.financeAccount.insert(1);
    const transactions = await db.financeAutoTransaction.insert(3, { accountId: account.id });
    return { resources: transactions, route: route(account.id) };
});
testGetCollectionOfSoftDeletedParentResource(async db => {
    const [account] = await db.financeAccount.insert(1, { deletedAt: new Date() });
    await db.financeAutoTransaction.insert(1, { accountId: account.id });
    return route(account.id);
});
