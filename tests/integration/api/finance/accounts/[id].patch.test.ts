import { BASE_ACCOUNT, FULL_ACCOUNT } from "~~/test-utils/constants/finance";
import { expect, test } from "~~/test-utils/playwright";
import { test401WhenLoggedOut, testIdParameter } from "~~/test-utils/playwright/utils/helpers";

const route = "/api/finance/accounts";
testIdParameter("patch", route, { deleted: true });

test("only allows a user to edit their own accounts", async ({ request, db }) => {
    const otherUser = await db.user.selectByEmail("cmontgomeryburns@springfieldnuclear.com");
    const [account] = await db.financeAccount.insert(1, { userId: otherUser!.id });
    expect(account.deletedAt).toBeNull();
    const response = await request.patch(`/api/finance/accounts/${account.id}`, { data: { deleted: true } });
    expect(response.status()).toBe(404);
    const [patchedAccount] = await db.financeAccount.select(account.id);
    expect(patchedAccount!.id).toBe(account.id);
});

test("only allows patching the deleted property", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1);
    const response = await request.patch(`/api/finance/accounts/${account.id}`, {
        data: { ...FULL_ACCOUNT, deleted: true },
    });
    expect(response.status()).toBe(204);
    const [patchedAccount] = await db.financeAccount.select(account.id);
    const { deletedAt: _, ...expected } = account;
    expect(patchedAccount).toStrictEqual(expect.objectContaining(expected));
    expect(patchedAccount!.deletedAt).not.toBeNull();
});

test("only modifies the requested account", async ({ request, db }) => {
    const otherUser = await db.user.selectByEmail("cmontgomeryburns@springfieldnuclear.com");
    const [otherAccount] = await db.financeAccount.insert(1, { userId: otherUser!.id });
    const [account] = await db.financeAccount.insert(1);
    expect(account.deletedAt).toBeNull();
    expect(otherAccount.deletedAt).toBeNull();
    await request.patch(`/api/finance/accounts/${account.id}`, { data: { deleted: true } });
    const [accountAfterPatch] = await db.financeAccount.select(account.id);
    const [otherAccountAfterPatch] = await db.financeAccount.select(otherAccount.id);

    const { deletedAt: _, ...expected } = account;
    expect(accountAfterPatch).toStrictEqual(expect.objectContaining(expected));
    expect(accountAfterPatch!.deletedAt).not.toBeNull();

    expect(otherAccountAfterPatch).toStrictEqual(otherAccount);
});

test("allows undoing a delete", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1, { deletedAt: new Date() });
    expect(account.deletedAt).not.toBe(null);
    await request.patch(`/api/finance/accounts/${account.id}`, { data: { ...BASE_ACCOUNT, deleted: false } });
    const [patchedAccount] = await db.financeAccount.select(account.id);
    expect(patchedAccount!.deletedAt).toBeNull();
});

test("returns a 204 even when the data hasn't changed", async ({ request, db }) => {
    await db.financeAccount.insert(1);
    const getResponseBefore = await request.get(route);
    const [accountBefore] = await getResponseBefore.json();
    const patchResponse = await request.patch(`/api/finance/accounts/${accountBefore.id}`, {
        data: { ...accountBefore, deleted: false },
    });
    expect(patchResponse.status()).toBe(204);
    const getResponseAfter = await request.get(route);
    const [accountAfter] = await getResponseAfter.json();
    expect(accountBefore).toStrictEqual(accountAfter);
});

test401WhenLoggedOut("patch", route);
