import type { DBFixtures } from "~~/test-utils/database/fixture";
import { date } from "~~/test-utils/helpers/data";
import { test } from "~~/test-utils/playwright";

const refDate = new Date("2025-08-15T12:00:00.000Z");

const setup = async (db: DBFixtures) => {
    const [account] = await db.financeAccount.insert(1);
    const categories = await db.financeCategory.insert(5, { accountId: account.id });
    const transactions = [];
    for (const category of categories) {
        transactions.push(
            ...(await db.financeTransaction.insert(50, seed => ({
                createdAt: date({ refDate, days: 25, seed }),
                accountId: account.id,
                categoryId: category.id,
            }))),
        );
    }
    return { transactions, categories };
};

test("allows filtering by reference", async ({ db, financePage: page }) => {
    const { transactions } = await setup(db);
    await page.page.clock.install({ time: refDate });
    await page.goto();

    await page.expect("balanceChart").toHaveScreenshot({ name: "balance-chart-before-filtering" });
    await page.click("filterMenuButton");
    await page.fill("filterReferenceInput", transactions[0]!.reference!);
    await page.expect("balanceChart").toHaveScreenshot({ name: "balance-chart-filtered-by-reference" });
    await page.expect("root").toMatchAriaSnapshot({ name: "account-tab-filtered-by-reference" });
});
