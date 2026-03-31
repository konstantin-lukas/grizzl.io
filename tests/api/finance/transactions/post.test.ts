import { BASE_TRANSACTION } from "~~/test-utils/constants/finance";
import { expect, test } from "~~/test-utils/playwright";
import { makeTransactionTestBuilder } from "~~/test-utils/playwright/builders/finance";

const route = (id: string) => `/api/finance/accounts/${id}/transactions`;

const testBuilder = makeTransactionTestBuilder("post");

testBuilder
    .returnsA401StatusCodeWhenAnUnauthenticatedRequestIsMade()
    .rejectsAnOperationOnASubResourceOwnedByAnotherUsersParentResource()
    .rejectsAnOperationOnASubResourceOnANonExistentParentResource()
    .rejectsRequestsWhenPayloadIsInvalid()
    .acceptsRequestsWhenPayloadIsValid()
    .build();

test("updates the account balance automatically", async ({ request, db }) => {
    let [account] = await db.financeAccount.insert(1);

    await request.post(route(account.id), { data: BASE_TRANSACTION });

    account = (await db.financeAccount.select())[0]!;
    expect(account.balance).toBe(BASE_TRANSACTION.amount);

    await request.post(route(account.id), {
        data: { ...BASE_TRANSACTION, amount: BASE_TRANSACTION.amount * -3 },
    });

    account = (await db.financeAccount.select())[0]!;
    expect(account.balance).toBe(BASE_TRANSACTION.amount * -2);
});

test("rejects creating a transaction if the resulting account balance is too large", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1, { balance: Number.MAX_SAFE_INTEGER });
    const response = await request.post(route(account.id), { data: BASE_TRANSACTION });
    expect(response.status()).toBe(409);
});

test("rejects creating a transaction if the resulting account balance is too small", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1, { balance: Number.MIN_SAFE_INTEGER });
    const response = await request.post(route(account.id), {
        data: { ...BASE_TRANSACTION, amount: -BASE_TRANSACTION.amount },
    });
    expect(response.status()).toBe(409);
});

test("automatically creates a new category when a matching one doesn't exist", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1);
    await request.post(route(account.id), {
        data: BASE_TRANSACTION,
    });
    const [category] = await db.financeCategory.select();
    expect(category!.displayName).toBe(BASE_TRANSACTION.category.name);
});

test("automatically updates a category when a matching one exists", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1);
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    expect(category.icon).not.toBe(BASE_TRANSACTION.category.icon);

    await request.post(route(account.id), {
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
    const [category] = await db.financeCategory.insert(1, { accountId: otherAccount.id });

    const data = { ...BASE_TRANSACTION, category: { ...BASE_TRANSACTION.category, name: category.displayName } };
    await request.post(route(myAccount.id), { data });

    const categories = await db.financeCategory.select();
    expect(categories).toHaveLength(2);
    expect(categories).toContainEqual(category);
});
