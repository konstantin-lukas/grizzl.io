import { BASE_AUTO_TRANSACTION } from "~~/test-utils/constants/finance";
import { expect, test } from "~~/test-utils/playwright";
import { makeAutoTransactionTestBuilder } from "~~/test-utils/playwright/utils/helpers/finance";

const route = (id: string) => `/api/finance/accounts/${id}/auto-transactions`;

const testBuilder = makeAutoTransactionTestBuilder("post");

testBuilder
    .returnsA401StatusCodeWhenAnUnauthenticatedRequestIsMade()
    .rejectsAnOperationOnASubResourceOwnedByAnotherUsersParentResource()
    .rejectsAnOperationOnASubResourceOnANonExistentParentResource()
    .rejectsRequestsWhenPayloadIsInvalid()
    .acceptsRequestsWhenPayloadIsValid()
    .build();

test("automatically creates a new category when a matching one doesn't exist", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1);
    await request.post(route(account.id), {
        data: BASE_AUTO_TRANSACTION,
    });
    const [category] = await db.financeCategory.select();
    expect(category!.displayName).toBe(BASE_AUTO_TRANSACTION.category.name);
});

test("automatically updates a category when a matching one exists", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1);
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    expect(category.icon).not.toBe(BASE_AUTO_TRANSACTION.category.icon);

    await request.post(route(account.id), {
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
    const [category] = await db.financeCategory.insert(1, { accountId: otherAccount.id });

    const data = {
        ...BASE_AUTO_TRANSACTION,
        category: { ...BASE_AUTO_TRANSACTION.category, name: category.displayName },
    };
    await request.post(route(myAccount.id), { data });

    const categories = await db.financeCategory.select();
    expect(categories).toHaveLength(2);
    expect(categories).toContainEqual(category);
});
