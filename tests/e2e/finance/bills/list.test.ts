import { str } from "~~/test-utils/helpers/data";
import { test } from "~~/test-utils/playwright";
import { SCREENSHOT } from "~~/test-utils/playwright/tags";

test(
    "shows upcoming bills at the top and paid bills at the bottom",
    { tag: SCREENSHOT },
    async ({ financePage: page, db }) => {
        const [account] = await db.financeAccount.insert(1);
        const categories = await db.financeCategory.insert(5, seed => ({
            accountId: account.id,
            displayName: str({ length: 20, seed }),
            normalizedName: str({ length: 20, spaces: false, seed }).toLowerCase(),
        }));
        for (const [index, category] of categories.entries()) {
            await db.financeAutoTransaction.insert(1, {
                categoryId: category.id,
                accountId: account.id,
                amount: -100_00,
                lastExec: "2026-04-20",
                execInterval: 1,
                execOn: 20,
            });

            if (index > 2) continue;

            await db.financeAutoTransaction.insert(1, {
                categoryId: category.id,
                accountId: account.id,
                amount: -100_00,
                lastExec: "2026-05-10",
                execInterval: 1,
                execOn: 10,
            });
        }
        await page.page.clock.install({ time: "2026-05-15" });
        await page.goto();
        await page.click("tabs", { nth: 2 });
        await page.expect().toBeValid({ name: "bills-tab-with-remaining-and-paid-bills" });
    },
);

test("shows an empty view when there are no bills", { tag: SCREENSHOT }, async ({ financePage: page, db }) => {
    await db.financeAccount.insert(1);
    await page.page.clock.install({ time: "2026-05-15" });
    await page.goto();
    await page.click("tabs", { nth: 2 });
    await page.expect().toBeValid({ name: "empty-bills-tab" });
});
