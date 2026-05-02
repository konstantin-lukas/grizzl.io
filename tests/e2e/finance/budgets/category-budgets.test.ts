import { str } from "~~/test-utils/helpers/data";
import { test } from "~~/test-utils/playwright";
import { SCREENSHOT } from "~~/test-utils/playwright/tags";

const today = new Date();
test(
    "shows your budgets for each category and how much you have used of those",
    { tag: SCREENSHOT },
    async ({ financePage: page, db }, testInfo) => {
        const [account] = await db.financeAccount.insert(1);
        const categories = await db.financeCategory.insert(10, seed => ({
            accountId: account.id,
            displayName: str({ length: 20, seed }),
            normalizedName: str({ length: 20, spaces: false, seed }).toLowerCase(),
        }));
        for (let i = 1; i <= 5; i++) {
            await db.financeTransaction.insert(2, j => ({
                amount: j % 2 === 0 ? i * 50 : i * -50,
                createdAt: today,
                categoryId: categories[i - 1]!.id,
                accountId: account.id,
            }));
            await db.financeAutoTransaction.insert(2, j => ({
                amount: j % 2 === 0 ? i * 100 : i * -100,
                createdAt: today,
                lastExec: today.toISOString().split("T")[0],
                execOn: today.getDate(),
                execInterval: 2,
                categoryId: categories[i]!.id,
                accountId: account.id,
            }));
        }
        await page.goto();
        await page.click("tabs", { nth: 1 });
        await page.expect("categoryBudgetContainer").toMatchAriaSnapshot({ name: "category-budgets" });

        // FOR SOME UNKNOWN REASON PLAYWRIGHT CAN'T TAKE A STABLE SCREENSHOT ON MOBILE CHROME
        if (testInfo.project.name === "mobile_chrome") return;
        await page.expect("categoryBudgetContainer").toHaveScreenshot({ name: "category-budgets" });
    },
);
