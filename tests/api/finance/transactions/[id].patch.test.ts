import { BASE_TRANSACTION, FULL_TRANSACTION } from "~~/test-utils/constants/finance";
import { expect, test } from "~~/test-utils/playwright";
import { test401WhenLoggedOut, testIdParameter } from "~~/test-utils/playwright/utils/helpers";

const route = (id: string) => `/api/finance/accounts/${id}/transactions`;

testIdParameter("patch", route("2222222222222222"), { deleted: true });
test401WhenLoggedOut("patch", route("2222222222222222"));

test("only allows a user to edit their own resources", async ({ request, db }) => {
    const otherUser = await db.user.selectByEmail("cmontgomeryburns@springfieldnuclear.com");
    const [otherAccount] = await db.financeAccount.insert(1, { userId: otherUser!.id });
    const [otherTransaction] = await db.financeTransaction.insert(1, { accountId: otherAccount.id });
    expect(otherTransaction.deletedAt).toBeNull();
    const response = await request.patch(`${route(otherAccount.id)}/${otherTransaction.id}`, {
        data: { deleted: true },
    });

    expect(response.status()).toBe(404);
    const [patchedData] = await db.financeTransaction.select(otherTransaction.id);
    expect(patchedData).toStrictEqual(otherTransaction);
});

test("only allows patching the deleted property", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1);
    const [transaction] = await db.financeTransaction.insert(1, { accountId: account.id });

    const response = await request.patch(`${route(account.id)}/${transaction.id}`, {
        data: { ...FULL_TRANSACTION, deleted: true },
    });
    expect(response.status()).toBe(204);
    const [patchedData] = await db.financeTransaction.select(transaction.id);
    const { deletedAt: _, ...expected } = transaction;
    expect(patchedData).toStrictEqual(expect.objectContaining(expected));
    expect(patchedData!.deletedAt).not.toBeNull();
});

test("only modifies the requested resource", async ({ request, db }) => {
    const otherUser = await db.user.selectByEmail("cmontgomeryburns@springfieldnuclear.com");
    const [otherAccount] = await db.financeAccount.insert(1, { userId: otherUser!.id });
    const [otherTransaction] = await db.financeTransaction.insert(1, { accountId: otherAccount.id });
    const [account] = await db.financeAccount.insert(1);
    const [transaction] = await db.financeTransaction.insert(1, { accountId: account.id });

    expect(transaction.deletedAt).toBeNull();
    expect(otherTransaction.deletedAt).toBeNull();
    await request.patch(`${route(account.id)}/${transaction.id}`, { data: { deleted: true } });
    const [dataAfterPatch] = await db.financeTransaction.select(transaction.id);
    const [otherDataAfterPatch] = await db.financeTransaction.select(otherTransaction.id);

    const { deletedAt: _, ...expected } = transaction;
    expect(dataAfterPatch).toStrictEqual(expect.objectContaining(expected));
    expect(dataAfterPatch!.deletedAt).not.toBeNull();

    expect(otherDataAfterPatch).toStrictEqual(otherTransaction);
});

test("allows undoing a delete", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1);
    const [data] = await db.financeTransaction.insert(1, { accountId: account.id, deletedAt: new Date() });
    expect(data.deletedAt).not.toBe(null);
    await request.patch(`${route(account.id)}/${data.id}`, { data: { ...BASE_TRANSACTION, deleted: false } });
    const [patchedData] = await db.financeTransaction.select(data.id);
    expect(patchedData!.deletedAt).toBeNull();
});

test("returns a 204 even when the resource hasn't changed", async ({ request, db }) => {
    const [account] = await db.financeAccount.insert(1);
    await db.financeTransaction.insert(1, { accountId: account.id });
    const getResponseBefore = await request.get(route(account.id));
    const [dataBefore] = await getResponseBefore.json();
    const patchResponse = await request.patch(`${route(account.id)}/${dataBefore.id}`, {
        data: { ...dataBefore, deleted: false },
    });
    expect(patchResponse.status()).toBe(204);
    const getResponseAfter = await request.get(route(account.id));
    const [dataAfter] = await getResponseAfter.json();
    expect(dataBefore).toStrictEqual(dataAfter);
});
