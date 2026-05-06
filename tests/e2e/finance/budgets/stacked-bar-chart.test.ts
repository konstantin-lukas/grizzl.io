import { str } from "~~/test-utils/helpers/data";
import { test } from "~~/test-utils/playwright";
import { SCREENSHOT } from "~~/test-utils/playwright/tags";

test(
    "shows how much money you spent on each category but does not include categories without expenses or incomes",
    { tag: SCREENSHOT },
    async ({ financePage: page, db }) => {
        const [account] = await db.financeAccount.insert(1);
        const categories = await db.financeCategory.insert(5, seed => ({
            accountId: account.id,
            displayName: str({ length: 20, seed }),
            normalizedName: str({ length: 20, spaces: false, seed }).toLowerCase(),
        }));

        const today = new Date();
        const [year, month, day] = today.toISOString().split("T")[0]!.split("-").map(Number) as [
            number,
            number,
            number,
        ];

        for (let i = 1; i <= 5; i++) {
            await db.financeTransaction.insert(12, j => {
                const offsetMonth = month - 1 - j;
                const effectiveMonth = offsetMonth < 0 ? 12 + offsetMonth : offsetMonth;
                const effectiveYear = offsetMonth < 0 ? year - 1 : year;
                return {
                    amount: i * -100_00,
                    createdAt: new Date(effectiveYear, effectiveMonth, day, 12),
                    categoryId: categories[i - 1]!.id,
                    accountId: account.id,
                };
            });
        }
        await page.goto();
        await page.click("tabs", { nth: 1 });
        await page.expect("previousExpensesChart").toHaveScreenshot({ name: "previous-expenses-stacked-bar-chart" });
    },
);
