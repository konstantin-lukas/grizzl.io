import { BASE_AUTO_TRANSACTION } from "~~/test-utils/constants/finance";
import { expect, test } from "~~/test-utils/playwright";
import { makeAutoTransactionTestBuilder } from "~~/test-utils/playwright/builders/finance";

const route = (id: string) => `/api/finance/accounts/${id}/auto-transactions`;

const testBuilder = makeAutoTransactionTestBuilder("put");

testBuilder
    .returnsA401StatusCodeWhenAnUnauthenticatedRequestIsMade()
    .rejectsAnOperationOnASubResourceOwnedByAnotherUsersParentResource()
    .rejectsAnOperationOnASubResourceWhenTheParentResourceIsNotAssociated()
    .rejectsAnOperationOnASubResourceOnANonExistentParentResource()
    .rejectsRequestsWhenPayloadIsInvalid()
    .acceptsRequestsWhenPayloadIsValid()
    .build();

test("automatically creates a new category when a matching one doesn't exist", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1);
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    const [transaction] = await db.financeAutoTransaction.insert(1, { accountId: account.id, categoryId: category.id });
    await request.put(`${route(account.id)}/${transaction.id}`, { data: BASE_AUTO_TRANSACTION });
    const categories = await db.financeCategory.select();
    expect(categories).toHaveLength(2);
    expect(categories).toContainEqual(
        expect.objectContaining({
            icon: BASE_AUTO_TRANSACTION.category.icon,
            displayName: BASE_AUTO_TRANSACTION.category.name,
        }),
    );
});

test("automatically updates a category when a matching one exists", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1);
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    const [transaction] = await db.financeAutoTransaction.insert(1, { accountId: account.id, categoryId: category.id });
    expect(category.icon).not.toBe(BASE_AUTO_TRANSACTION.category.icon);

    await request.put(`${route(account.id)}/${transaction.id}`, {
        data: { ...BASE_AUTO_TRANSACTION, category: { ...BASE_AUTO_TRANSACTION.category, name: category.displayName } },
    });

    const categories = await db.financeCategory.select();
    expect(categories).toHaveLength(1);
    expect(categories[0]!.icon).toBe(BASE_AUTO_TRANSACTION.category.icon);
});

test("does not alter other users' categories", async ({ request, db }) => {
    const otherUser = await db.user.selectByEmail("cmontgomeryburns@springfieldnuclear.com");
    const [myAccount] = await db.financeAccount.insert(1);
    const [otherAccount] = await db.financeAccount.insert(1, { userId: otherUser!.id });
    const [myCategory, otherCategory] = await db.financeCategory.insert(2, i => ({
        accountId: i === 0 ? myAccount.id : otherAccount.id,
    }));
    const [myTransaction] = await db.financeAutoTransaction.insert(1, {
        accountId: myAccount.id,
        categoryId: myCategory.id,
    });

    const data = {
        ...BASE_AUTO_TRANSACTION,
        category: { ...BASE_AUTO_TRANSACTION.category, name: otherCategory.displayName },
    };
    await request.put(`${route(myAccount.id)}/${myTransaction.id}`, { data });

    const categories = await db.financeCategory.select();
    expect(categories).toHaveLength(3);
    expect(categories).toContainEqual(otherCategory);
});
