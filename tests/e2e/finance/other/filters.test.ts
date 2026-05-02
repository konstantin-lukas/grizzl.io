import type { DBFixtures } from "~~/test-utils/database/fixture";
import { date, int } from "~~/test-utils/helpers/data";
import { test } from "~~/test-utils/playwright";

const refDate = new Date("2025-08-15T12:00:00.000Z");

const setup = async (db: DBFixtures) => {
    const [account] = await db.financeAccount.insert(1);
    const categories = await db.financeCategory.insert(5, { accountId: account.id });
    const transactions = [];
    for (const [index, category] of categories.entries()) {
        transactions.push(
            ...(await db.financeTransaction.insert(50, seed => ({
                createdAt: date({ refDate, days: 25, seed }),
                accountId: account.id,
                categoryId: category.id,
                amount: int({ min: -150_00, max: 150_00, seed: seed + 50 * index }),
            }))),
        );
    }
    return { transactions };
};

test("allows filtering by reference", async ({ db, financePage: page }) => {
    const { transactions } = await setup(db);
    await page.page.clock.install({ time: refDate });
    await page.goto();

    await page.expect("balanceChartCanvas").toHaveScreenshot({ name: "balance-chart-before-filtering" });
    await page.click("filterMenuButton");
    await page.fill("filterReferenceInput", transactions[0]!.reference!);

    await page.page.waitForResponse(url => url.url().includes("/transactions"));
    await page.expect("root").toMatchAriaSnapshot({ name: "account-tab-filtered-by-reference" });
    await page.expect("balanceChartCanvas").toHaveScreenshot({ name: "balance-chart-filtered-by-reference" });
});

test("allows filtering by category", async ({ db, financePage: page }) => {
    await setup(db);
    await page.page.clock.install({ time: refDate });
    await page.goto();

    await page.expect("balanceChartCanvas").toHaveScreenshot({ name: "balance-chart-before-filtering" });
    await page.click("filterMenuButton");

    await page.click("filterCategorySelect");
    const promise = page.page.waitForResponse(url => url.url().includes("/transactions"));
    await page.page.keyboard.press("Enter");
    await promise;

    await page.page.waitForResponse(url => url.url().includes("/transactions"));
    await page.expect("balanceChartCanvas").toHaveScreenshot({ name: "balance-chart-filtered-by-category" });
    await page.expect("root").toMatchAriaSnapshot({ name: "account-tab-filtered-by-category" });
});

test("allows filtering by date range", async ({ db, financePage: page }) => {
    await setup(db);
    await page.page.clock.install({ time: refDate });
    await page.goto();

    await page.expect("balanceChartCanvas").toHaveScreenshot({ name: "balance-chart-before-filtering" });
    await page.click("filterMenuButton");

    await page.click("filterDateRangePicker", { position: { x: 10, y: 10 } });
    const promise = page.page.waitForResponse(url => url.url().includes("/transactions"));
    await page.page.keyboard.type("81220258152025");
    await promise;

    await page.expect("balanceChartCanvas").toHaveScreenshot({ name: "balance-chart-filtered-by-date-range" });
    await page.expect("root").toMatchAriaSnapshot({ name: "account-tab-filtered-by-date-range" });
});
