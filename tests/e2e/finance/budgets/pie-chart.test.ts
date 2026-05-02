import { str } from "~~/test-utils/helpers/data";
import { test } from "~~/test-utils/playwright";
import { SCREENSHOT } from "~~/test-utils/playwright/tags";

test(
    "shows how much money you spent on each category but does not include categories without expenses or incomes",
    { tag: SCREENSHOT },
    async ({ financePage: page, db }) => {
        const [account] = await db.financeAccount.insert(1);
        const categories = await db.financeCategory.insert(10, seed => ({
            accountId: account.id,
            displayName: str({ length: 20, seed }),
            normalizedName: str({ length: 20, spaces: false, seed }).toLowerCase(),
        }));
        for (let i = 1; i <= 5; i++) {
            await db.financeTransaction.insert(2, j => ({
                amount: j % 2 === 0 ? i * 100 : i * -100,
                createdAt: new Date(),
                categoryId: categories[i - 1]!.id,
                accountId: account.id,
            }));
        }
        await page.goto();
        await page.click("tabs", { nth: 1 });
        await page.expect("expensePieChart").toBeValid({ name: "expenses-pie-chart" });
    },
);
