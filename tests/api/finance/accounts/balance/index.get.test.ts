import { expect, test } from "~~/test-utils/playwright";
import { withoutAuth } from "~~/test-utils/playwright/utils/auth";

const route = (accountId: string) => `/api/finance/accounts/${accountId}/balance`;

function createQuery(params: { to?: string; reference?: string; categoryId?: string }) {
    const query = new URLSearchParams();
    if (params.to) query.set("to", params.to);
    if (params.reference) query.set("reference", params.reference);
    if (params.categoryId) query.set("categoryId", params.categoryId);
    return query.toString();
}

withoutAuth(() => {
    test("returns a 401 status code when an unauthenticated request is made", async ({ request, db }) => {
        const [account] = await db.financeAccount.insert(1);
        const response = await request.get(`${route(account.id)}?to=2025-01-20T00:00:00.000Z`);
        expect(response.status()).toBe(401);
    });
});

test("returns 400 when account id has wrong format", async ({ request }) => {
    const response = await request.get(`${route("bananas")}?to=2025-01-20T00:00:00.000Z`);
    expect(response.status()).toBe(400);
});

test("returns 400 when required query param `to` is missing or invalid", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1);

    const missingTo = await request.get(route(account.id));
    expect(missingTo.status()).toBe(400);

    const invalidTo = await request.get(`${route(account.id)}?to=not-a-date`);
    expect(invalidTo.status()).toBe(400);
});

test("returns the summed balance up to and including `to`", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1);
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });

    await db.financeTransaction.insert(3, {
        accountId: account.id,
        categoryId: category.id,
    });

    const response = await request.get(`${route(account.id)}?to=2025-01-20T00:00:00.000Z`);
    expect(response.status()).toBe(200);
    expect(await response.json()).toBe(4990);
});

test("applies reference and category filters, escaping wildcard characters", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1);
    const [categoryA, categoryB] = await db.financeCategory.insert(2, { accountId: account.id });

    await db.financeTransaction.insert(1, {
        accountId: account.id,
        categoryId: categoryA.id,
        amount: 100,
        reference: "ABC%123_XYZ",
        createdAt: new Date("2025-01-10T00:00:00.000Z"),
    });

    await db.financeTransaction.insert(1, {
        accountId: account.id,
        categoryId: categoryA.id,
        amount: 200,
        reference: "ABCX123YXYZ",
        createdAt: new Date("2025-01-10T00:00:00.000Z"),
    });

    await db.financeTransaction.insert(1, {
        accountId: account.id,
        categoryId: categoryB.id,
        amount: 300,
        reference: "ABC%123_XYZ",
        createdAt: new Date("2025-01-10T00:00:00.000Z"),
    });

    const query = createQuery({
        to: "2025-12-31T00:00:00.000Z",
        reference: "ABC%123_",
        categoryId: categoryA.id,
    });

    const response = await request.get(`${route(account.id)}?${query}`);
    expect(response.status()).toBe(200);
    expect(await response.json()).toBe(100);
});

test("returns a 404 for accounts not owned by the current user and for soft-deleted accounts", async ({
    request,
    db,
}) => {
    const otherUser = (await db.user.selectByEmail("cmontgomeryburns@springfieldnuclear.com"))!;

    const [otherUsersAccount] = await db.financeAccount.insert(1, { userId: otherUser.id });
    const [otherUsersCategory] = await db.financeCategory.insert(1, { accountId: otherUsersAccount.id });
    await db.financeTransaction.insert(1, {
        accountId: otherUsersAccount.id,
        categoryId: otherUsersCategory.id,
        amount: 777,
        createdAt: new Date("2025-01-10T00:00:00.000Z"),
    });

    const [myDeletedAccount] = await db.financeAccount.insert(1, { deletedAt: new Date() });
    const [myDeletedCategory] = await db.financeCategory.insert(1, { accountId: myDeletedAccount.id });
    await db.financeTransaction.insert(1, {
        accountId: myDeletedAccount.id,
        categoryId: myDeletedCategory.id,
        amount: 555,
        createdAt: new Date("2025-01-10T00:00:00.000Z"),
    });

    const foreignResponse = await request.get(`${route(otherUsersAccount.id)}?to=2025-12-31T00:00:00.000Z`);
    expect(foreignResponse.status()).toBe(404);

    const deletedResponse = await request.get(`${route(myDeletedAccount.id)}?to=2025-12-31T00:00:00.000Z`);
    expect(deletedResponse.status()).toBe(404);
});
