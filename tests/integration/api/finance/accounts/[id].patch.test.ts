import { BASE_ACCOUNT, FULL_ACCOUNT } from "~~/test-utils/constants/finance";
import { expect, test } from "~~/test-utils/playwright";
import { test401WhenLoggedOut, testIdParameter } from "~~/test-utils/playwright/utils/helpers";

const route = "/api/finance/accounts";

testIdParameter("patch", route, { deleted: true });
test401WhenLoggedOut("patch", route);

test("only allows a user to edit their own resources", async ({ request, db }) => {
    const otherUser = await db.user.selectByEmail("cmontgomeryburns@springfieldnuclear.com");
    const [data] = await db.financeAccount.insert(1, { userId: otherUser!.id });
    expect(data.deletedAt).toBeNull();
    const response = await request.patch(`${route}/${data.id}`, { data: { deleted: true } });
    expect(response.status()).toBe(404);
    const [patchedData] = await db.financeAccount.select(data.id);
    expect(patchedData!.id).toBe(data.id);
});

test("only allows patching the deleted property", async ({ request, db }) => {
    const [data] = await db.financeAccount.insert(1);
    const response = await request.patch(`${route}/${data.id}`, { data: { ...FULL_ACCOUNT, deleted: true } });
    expect(response.status()).toBe(204);
    const [patchedData] = await db.financeAccount.select(data.id);
    const { deletedAt: _, ...expected } = data;
    expect(patchedData).toStrictEqual(expect.objectContaining(expected));
    expect(patchedData!.deletedAt).not.toBeNull();
});

test("only modifies the requested resource", async ({ request, db }) => {
    const otherUser = await db.user.selectByEmail("cmontgomeryburns@springfieldnuclear.com");
    const [otherData] = await db.financeAccount.insert(1, { userId: otherUser!.id });
    const [data] = await db.financeAccount.insert(1);
    expect(data.deletedAt).toBeNull();
    expect(otherData.deletedAt).toBeNull();
    await request.patch(`${route}/${data.id}`, { data: { deleted: true } });
    const [dataAfterPatch] = await db.financeAccount.select(data.id);
    const [otherDataAfterPatch] = await db.financeAccount.select(otherData.id);

    const { deletedAt: _, ...expected } = data;
    expect(dataAfterPatch).toStrictEqual(expect.objectContaining(expected));
    expect(dataAfterPatch!.deletedAt).not.toBeNull();

    expect(otherDataAfterPatch).toStrictEqual(otherData);
});

test("allows undoing a delete", async ({ request, db }) => {
    const [data] = await db.financeAccount.insert(1, { deletedAt: new Date() });
    expect(data.deletedAt).not.toBe(null);
    await request.patch(`${route}/${data.id}`, { data: { ...BASE_ACCOUNT, deleted: false } });
    const [patchedData] = await db.financeAccount.select(data.id);
    expect(patchedData!.deletedAt).toBeNull();
});

test("returns a 204 even when the resource hasn't changed", async ({ request, db }) => {
    await db.financeAccount.insert(1);
    const getResponseBefore = await request.get(route);
    const [dataBefore] = await getResponseBefore.json();
    const patchResponse = await request.patch(`${route}/${dataBefore.id}`, {
        data: { ...dataBefore, deleted: false },
    });
    expect(patchResponse.status()).toBe(204);
    const getResponseAfter = await request.get(route);
    const [dataAfter] = await getResponseAfter.json();
    expect(dataBefore).toStrictEqual(dataAfter);
});
