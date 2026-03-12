import { sortByCreatedAt } from "~~/test-utils/helpers/sort";
import { expect, test } from "~~/test-utils/playwright";
import { COMMON_TEST_CASES } from "~~/test-utils/playwright/utils/common";
import { test401WhenLoggedOut } from "~~/test-utils/playwright/utils/helpers";

for (const {
    route,
    fixture,
    insertFunction,
    defaultCollectionSortBy,
    defaultCollectionSortOrder,
} of COMMON_TEST_CASES) {
    test.describe(route, async () => {
        test401WhenLoggedOut("get", route);

        test("returns an empty array when there are is no data", async ({ request }) => {
            const response = await request.get(route);
            expect(response.status()).toBe(200);
            expect(await response.json()).toStrictEqual([]);
        });

        test("does not return data from other users", async ({ request, db }) => {
            const user = await db.user.selectByEmail("cmontgomeryburns@springfieldnuclear.com");
            await db[fixture].insert(1, { userId: user!.id });
            const response = await request.get(route);
            expect(response.status()).toBe(200);
            expect(await response.json()).toStrictEqual([]);
        });

        test("does not return soft-deleted data", async ({ request, db }) => {
            await db[fixture].insert(3, i => ({ deletedAt: i === 0 ? null : new Date() }));
            const response = await request.get(route);
            expect(response.status()).toBe(200);
            expect(await response.json()).toHaveLength(1);
        });

        if (defaultCollectionSortBy === "createdAt" && defaultCollectionSortOrder === "desc") {
            test("allows retrieving a list sorted by creation date", async ({ request, db }) => {
                const accounts = insertFunction ? await insertFunction(db) : await db[fixture].insert(3);
                sortByCreatedAt(accounts, "desc");

                const response = await request.get(route);
                const expectedAccounts = accounts.map(({ createdAt, ...rest }) => {
                    const data = {
                        ...rest,
                        createdAt: createdAt.toISOString(),
                    };
                    if ("userId" in data) {
                        delete (data as { userId?: string }).userId;
                    }
                    if ("deletedAt" in data) {
                        delete (data as { deletedAt?: Date }).deletedAt;
                    }
                    return data;
                });

                expect(response.status()).toBe(200);
                expect(await response.json()).toStrictEqual(expectedAccounts);
            });
        }
    });
}
