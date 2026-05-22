import { str } from "~~/test-utils/helpers/data";
import { test } from "~~/test-utils/playwright";
import { SCREENSHOT } from "~~/test-utils/playwright/tags";

const BASE_AUTO_TRANSACTION_1 = {
    id: "i4fDJdzZtt3UhwSG",
    createdAt: "2025-05-18T01:18:19.000Z",
    amount: -10000,
    reference: "potentivoluptatemolestieullamcoenimeuismodsintirureelitestlectusconsectetuerduiplaceratpraesentutsod",
    execInterval: 1,
    execOn: 20,
    lastExec: "2026-04-20",
    category: {
        id: "KTEHimtMEhxLGXNJ",
        name: "Vitae lobortis pell.",
        icon: "child-friendly-outline-rounded",
    },
};

const BASE_AUTO_TRANSACTION_2 = {
    id: "6qtYzdaxuaFefvAc",
    createdAt: "2025-05-18T01:18:19.000Z",
    amount: -10000,
    reference: "potentivoluptatemolestieullamcoenimeuismodsintirureelitestlectusconsectetuerduiplaceratpraesentutsod",
    execInterval: 1,
    execOn: 10,
    lastExec: "2026-05-10",
    category: {
        id: "KTEHimtMEhxLGXNJ",
        name: "Vitae lobortis pell.",
        icon: "child-friendly-outline-rounded",
    },
};

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

        const autoTransactions: (typeof BASE_AUTO_TRANSACTION_1)[] = [];

        for (const [index, category] of categories.entries()) {
            autoTransactions.push({
                ...BASE_AUTO_TRANSACTION_1,
                category: {
                    id: category.id,
                    name: category.displayName,
                    icon: category.icon,
                },
            });

            if (index > 2) continue;

            autoTransactions.push({
                ...BASE_AUTO_TRANSACTION_2,
                category: {
                    id: category.id,
                    name: category.displayName,
                    icon: category.icon,
                },
            });
        }

        await page.page.route(`/api/finance/accounts/${account.id}/auto-transactions`, async route => {
            await route.fulfill({ json: autoTransactions });
        });

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
