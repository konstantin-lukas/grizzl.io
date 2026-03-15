import { sortByCreatedAt } from "~~/test-utils/helpers/sort";
import { expect, test } from "~~/test-utils/playwright";
import { test401WhenLoggedOut } from "~~/test-utils/playwright/utils/helpers";

const route = "/api/finance/accounts";

test401WhenLoggedOut("get", route);

test("allows retrieving a list of resources sorted by creation date", async ({ request, db }) => {
    const data = (await db.financeAccount.insert(1)).map(({ createdAt, userId, deletedAt, ...rest }) => ({
        ...rest,
        createdAt: createdAt.toISOString(),
    }));
    sortByCreatedAt(data, "desc");
    const response = await request.get(route);
    expect(response.status()).toBe(200);
    expect(await response.json()).toStrictEqual(data);
});

test("returns an empty array when there are no resources", async ({ request }) => {
    const response = await request.get(route);
    expect(response.status()).toBe(200);
    expect(await response.json()).toStrictEqual([]);
});

test("does not return soft-deleted resources", async ({ request, db }) => {
    await db.financeAccount.insert(1, { deletedAt: new Date() });
    const response = await request.get(route);
    expect(response.status()).toBe(200);
    expect(await response.json()).toStrictEqual([]);
});

test("does not return resources of other users", async ({ request, db }) => {
    const user = await db.user.selectByEmail("cmontgomeryburns@springfieldnuclear.com");
    await db.financeAccount.insert(1, { userId: user!.id });
    const response = await request.get(route);
    expect(response.status()).toBe(200);
    expect(await response.json()).toStrictEqual([]);
});
