import { expect, test } from "~~/test-utils/playwright";
import { makeTransactionTestBuilder } from "~~/test-utils/playwright/builders/finance";

const testBuilder = makeTransactionTestBuilder("patch");

testBuilder
    .returnsA401StatusCodeWhenAnUnauthenticatedRequestIsMade()
    .returnsA400StatusCodeWhenTheProvidedIdHasTheWrongFormat()
    .returnsA404StatusCodeWhenTheProvidedIdIsUnknown()
    .onlySoftDeletesTheRequestedResource()
    .onlyAllowsPatchingTheDeletedProperty()
    .onlyAllowsAUserToSoftDeleteTheirOwnResources()
    .allowsUndoingADelete()
    .rejectsAnOperationOnASubResourceOwnedByAnotherUsersParentResource()
    .rejectsAnOperationOnASubResourceOnANonExistentParentResource()
    .rejectsAnOperationOnASubResourceWhenTheParentResourceIsNotAssociated()
    .build();

test("automatically adjusts the account balance when a positive transaction is deleted", async ({ db, request }) => {
    const [account] = await db.financeAccount.insert(1);
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    const [transaction] = await db.financeTransaction.insert(1, {
        accountId: account.id,
        categoryId: category.id,
        amount: 10,
    });

    await request.patch(`/api/finance/accounts/${account.id}/transactions/${transaction.id}`, {
        data: { deleted: true },
    });

    const [patchedAccount] = await db.financeAccount.select(account.id);
    expect(patchedAccount!.balance).toBe(-10);
});

test("automatically adjusts the account balance when a negative transaction is deleted", async ({ db, request }) => {
    const [account] = await db.financeAccount.insert(1);
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    const [transaction] = await db.financeTransaction.insert(1, {
        accountId: account.id,
        categoryId: category.id,
        amount: -10,
    });

    await request.patch(`/api/finance/accounts/${account.id}/transactions/${transaction.id}`, {
        data: { deleted: true },
    });

    const [patchedAccount] = await db.financeAccount.select(account.id);
    expect(patchedAccount!.balance).toBe(10);
});

test("automatically adjusts the account balance when a positive transaction is undeleted", async ({ db, request }) => {
    const [account] = await db.financeAccount.insert(1);
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    const [transaction] = await db.financeTransaction.insert(1, {
        accountId: account.id,
        categoryId: category.id,
        deletedAt: new Date(),
        amount: 10,
    });

    await request.patch(`/api/finance/accounts/${account.id}/transactions/${transaction.id}`, {
        data: { deleted: false },
    });

    const [patchedAccount] = await db.financeAccount.select(account.id);
    expect(patchedAccount!.balance).toBe(10);
});

test("automatically adjusts the account balance when a negative transaction is undeleted", async ({ db, request }) => {
    const [account] = await db.financeAccount.insert(1);
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    const [transaction] = await db.financeTransaction.insert(1, {
        accountId: account.id,
        categoryId: category.id,
        deletedAt: new Date(),
        amount: -10,
    });

    await request.patch(`/api/finance/accounts/${account.id}/transactions/${transaction.id}`, {
        data: { deleted: false },
    });

    const [patchedAccount] = await db.financeAccount.select(account.id);
    expect(patchedAccount!.balance).toBe(-10);
});
