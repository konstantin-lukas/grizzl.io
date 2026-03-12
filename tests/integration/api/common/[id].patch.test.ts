import { expect, test } from "~~/test-utils/playwright";
import { COMMON_TEST_CASES } from "~~/test-utils/playwright/utils/common";
import { test401WhenLoggedOut, testIdParameter } from "~~/test-utils/playwright/utils/helpers";

for (const { route, fixture, fullData, baseData } of COMMON_TEST_CASES) {
    test.describe(route, async () => {
        testIdParameter("patch", route, { deleted: true });
        test401WhenLoggedOut("patch", route);

        test("only allows a user to edit their own data", async ({ request, db }) => {
            const otherUser = await db.user.selectByEmail("cmontgomeryburns@springfieldnuclear.com");
            const [insertedRow] = await db[fixture].insert(1, { userId: otherUser!.id });
            expect(insertedRow.deletedAt).toBeNull();
            const response = await request.patch(`${route}/${insertedRow.id}`, { data: { deleted: true } });
            expect(response.status()).toBe(404);
            const [patchedRow] = await db[fixture].select(insertedRow.id);
            expect(patchedRow!.id).toBe(insertedRow.id);
        });

        test("only allows patching the deleted property", async ({ request, db }) => {
            const [insertedRow] = await db[fixture].insert(1);
            const response = await request.patch(`${route}/${insertedRow.id}`, {
                data: { ...fullData, deleted: true },
            });
            expect(response.status()).toBe(204);
            const [patchedRow] = await db[fixture].select(insertedRow.id);
            const { deletedAt: _, ...expected } = insertedRow;
            expect(patchedRow).toStrictEqual(expect.objectContaining(expected));
            expect(patchedRow!.deletedAt).not.toBeNull();
        });

        test("only modifies the requested resource", async ({ request, db }) => {
            const otherUser = await db.user.selectByEmail("cmontgomeryburns@springfieldnuclear.com");
            const [otherRow] = await db[fixture].insert(1, { userId: otherUser!.id });
            const [insertedRow] = await db[fixture].insert(1);
            expect(insertedRow.deletedAt).toBeNull();
            expect(otherRow.deletedAt).toBeNull();
            await request.patch(`${route}/${insertedRow.id}`, { data: { deleted: true } });
            const [accountAfterPatch] = await db[fixture].select(insertedRow.id);
            const [otherAccountAfterPatch] = await db[fixture].select(otherRow.id);

            const { deletedAt: _, ...expected } = insertedRow;
            expect(accountAfterPatch).toStrictEqual(expect.objectContaining(expected));
            expect(accountAfterPatch!.deletedAt).not.toBeNull();

            expect(otherAccountAfterPatch).toStrictEqual(otherRow);
        });

        test("allows undoing a delete", async ({ request, db }) => {
            const [insertedRow] = await db[fixture].insert(1, { deletedAt: new Date() });
            expect(insertedRow.deletedAt).not.toBe(null);
            await request.patch(`${route}/${insertedRow.id}`, { data: { ...baseData, deleted: false } });
            const [patchedAccount] = await db[fixture].select(insertedRow.id);
            expect(patchedAccount!.deletedAt).toBeNull();
        });

        test("returns a 204 even when the data hasn't changed", async ({ request, db }) => {
            await db[fixture].insert(1);
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
    });
}
