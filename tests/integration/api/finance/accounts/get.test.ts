import { sortByCreatedAt } from "~~/test-utils/helpers/sort";
import { expect, test } from "~~/test-utils/playwright";
import { test401WhenLoggedOut } from "~~/test-utils/playwright/utils/helpers";

test("allows retrieving a list of accounts sorted by creation date", async ({ request, db }) => {
    const accounts = await db.financeAccount.insert(3);
    sortByCreatedAt(accounts, "desc");

    const response = await request.get("/api/finance/accounts");
    const expectedAccounts = accounts.map(({ deletedAt, userId, createdAt, ...rest }) => ({
        ...rest,
        createdAt: createdAt.toISOString(),
    }));

    expect(response.status()).toBe(200);
    expect(await response.json()).toStrictEqual(expectedAccounts);
});

test("returns an empty array when there are no accounts", async ({ request }) => {
    const response = await request.get("/api/finance/accounts");
    expect(response.status()).toBe(200);
    expect(await response.json()).toStrictEqual([]);
});

test("does not return soft-deleted accounts", async ({ request, db }) => {
    await db.financeAccount.insert(1, { deletedAt: new Date() });
    const response = await request.get("/api/finance/accounts");
    expect(response.status()).toBe(200);
    expect(await response.json()).toStrictEqual([]);
});

test("does not return accounts from other users", async ({ request, db }) => {
    const user = await db.user.selectByEmail("cmontgomeryburns@springfieldnuclear.com");
    await db.financeAccount.insert(1, { userId: user!.id });
    const response = await request.get("/api/timers");
    expect(response.status()).toBe(200);
    expect(await response.json()).toStrictEqual([]);
});

test401WhenLoggedOut("get", "/api/finance/accounts");
