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
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    await db.financeAutoTransaction.insert(1, { accountId: account.id, categoryId: category.id });
    return route(account.id);
});
testGetSoftDeletedCollection(async db => {
    const [account] = await db.financeAccount.insert(1);
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    await db.financeAutoTransaction.insert(1, {
        accountId: account.id,
        categoryId: category.id,
        deletedAt: new Date(),
    });
    return route(account.id);
});
testGetCollectionSubResourceFiltering(async db => {
    const [account1, account2] = await db.financeAccount.insert(2);
    const [category] = await db.financeCategory.insert(1, { accountId: account1.id });
    const transactions = await db.financeAutoTransaction.insert(2, {
        accountId: account1.id,
        categoryId: category.id,
    });
    return {
        subResources: transactions,
        thisRoute: route(account1.id),
        otherRoute: route(account2.id),
    };
});
testGetCollectionSortedByCreationDate(async db => {
    const [account] = await db.financeAccount.insert(1);
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    const transactions = await db.financeAutoTransaction.insert(3, { accountId: account.id, categoryId: category.id });
    return { resources: transactions, route: route(account.id) };
});
testGetCollectionOfSoftDeletedParentResource(async db => {
    const [account] = await db.financeAccount.insert(1, { deletedAt: new Date() });
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    await db.financeAutoTransaction.insert(1, { accountId: account.id, categoryId: category.id });
    return route(account.id);
});
