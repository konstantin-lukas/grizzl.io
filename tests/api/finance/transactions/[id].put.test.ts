import { BASE_TRANSACTION } from "~~/test-utils/constants/finance";
import { expect, test } from "~~/test-utils/playwright";
import { makeTransactionTestBuilder } from "~~/test-utils/playwright/builders/finance";

const route = (id: string) => `/api/finance/accounts/${id}/transactions`;

const testBuilder = makeTransactionTestBuilder("put");

testBuilder
    .returnsA401StatusCodeWhenAnUnauthenticatedRequestIsMade()
    .rejectsAnOperationOnASubResourceOwnedByAnotherUsersParentResource()
    .rejectsAnOperationOnASubResourceWhenTheParentResourceIsNotAssociated()
    .rejectsAnOperationOnASubResourceOnANonExistentParentResource()
    .rejectsRequestsWhenPayloadIsInvalid()
    .acceptsRequestsWhenPayloadIsValid()
    .build();

test("updates the account balance automatically", async ({ request, db }) => {
    let [account] = await db.financeAccount.insert(1);
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    const [transaction] = await db.financeTransaction.insert(1, {
        accountId: account.id,
        categoryId: category.id,
        amount: 0,
    });
    await request.put(`${route(account.id)}/${transaction.id}`, {
        data: { ...BASE_TRANSACTION, categoryId: category.id },
    });

    account = (await db.financeAccount.select())[0]!;
    expect(account.balance).toBe(BASE_TRANSACTION.amount);
});

test("rejects updating a transaction if the resulting account balance is too large", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1, { balance: 2 });
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    const [transaction] = await db.financeTransaction.insert(2, {
        accountId: account.id,
        categoryId: category.id,
        amount: 1,
    });
    const response = await request.put(`${route(account.id)}/${transaction.id}`, {
        data: { ...BASE_TRANSACTION, categoryId: category.id, amount: Number.MAX_SAFE_INTEGER },
    });
    expect(response.status()).toBe(409);
});

test("rejects updating a transaction if the resulting account balance is too small", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1, { balance: -2 });
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    const [transaction] = await db.financeTransaction.insert(2, {
        accountId: account.id,
        categoryId: category.id,
        amount: -1,
    });
    const response = await request.put(`${route(account.id)}/${transaction.id}`, {
        data: { ...BASE_TRANSACTION, categoryId: category.id, amount: Number.MIN_SAFE_INTEGER },
    });
    expect(response.status()).toBe(409);
});

test("automatically creates a new category when a matching one doesn't exist", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1);
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    const [transaction] = await db.financeTransaction.insert(1, { accountId: account.id, categoryId: category.id });
    await request.put(`${route(account.id)}/${transaction.id}`, { data: BASE_TRANSACTION });
    const categories = await db.financeCategory.select();
    expect(categories).toHaveLength(2);
    expect(categories).toContainEqual(
        expect.objectContaining({ icon: BASE_TRANSACTION.category.icon, displayName: BASE_TRANSACTION.category.name }),
    );
});

test("automatically updates a category when a matching one exists", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1);
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    const [transaction] = await db.financeTransaction.insert(1, { accountId: account.id, categoryId: category.id });
    expect(category.icon).not.toBe(BASE_TRANSACTION.category.icon);

    await request.put(`${route(account.id)}/${transaction.id}`, {
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
    const [myCategory, otherCategory] = await db.financeCategory.insert(2, i => ({
        accountId: i === 0 ? myAccount.id : otherAccount.id,
    }));
    const [myTransaction] = await db.financeTransaction.insert(1, {
        accountId: myAccount.id,
        categoryId: myCategory.id,
    });

    const data = { ...BASE_TRANSACTION, category: { ...BASE_TRANSACTION.category, name: otherCategory.displayName } };
    await request.put(`${route(myAccount.id)}/${myTransaction.id}`, { data });

    const categories = await db.financeCategory.select();
    expect(categories).toHaveLength(3);
    expect(categories).toContainEqual(otherCategory);
});
