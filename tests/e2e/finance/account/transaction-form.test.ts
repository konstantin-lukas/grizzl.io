import { date } from "~~/test-utils/helpers/data";
import { expect, test } from "~~/test-utils/playwright";
import { SCREENSHOT } from "~~/test-utils/playwright/tags";

test(
    "automatically updates the account tab content when add or deleting a transaction",
    { tag: SCREENSHOT },
    async ({ financePage: page, db }) => {
        await db.financeAccount.insert(1);
        await page.goto();

        await page.expect("transactionCards").toHaveCount(0);
        await page.click("transactionCreateButton");
        await page.completeTransactionUpsertForm({ submit: false });

        // FOR SOME REASON THE SCREENSHOT ASSERTION DOESN'T AUTO RETRY ON MOBILE CHROME
        await page.page.waitForRequest("/api/finance/category-icon?categoryName=Dog+Food");

        await page.expect("drawer").toHaveScreenshot({ name: "filled-transaction-upsert-form" });
        await page.click("upsertSubmit");

        await page.expect("transactionCards").toHaveCount(1);
        await page.expect("root").toMatchAriaSnapshot({ name: "account-tab-after-inserting-one-transaction" });

        await page.click("transactionDeleteButtons", { nth: 0 });
        await page.expect("transactionCards").toHaveCount(0);
    },
);

test("allows overriding the suggested icon and changing the icon for the entire category", async ({
    financePage: page,
    db,
}) => {
    const [account] = await db.financeAccount.insert(1);
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    await page.goto();

    await page.click("transactionCreateButton");
    await page.completeTransactionUpsertForm({ category: category.displayName, submit: false });
    await page.click("categorySelect");
    await page.click("categoryOptions", { nth: 0 });
    await page.click("upsertSubmit");

    await page.expect("transactionCards").toBeAttached();

    const [updatedCategory] = await db.financeCategory.select();
    expect(category.icon).not.toBe(updatedCategory?.icon);
    expect(updatedCategory?.icon).toBe("flight-rounded");
});

test("automatically updates the account tab when editing a transaction", async ({ financePage: page, db }) => {
    const [account] = await db.financeAccount.insert(1);
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    const transactions = await db.financeTransaction.insert(10, i => ({
        accountId: account.id,
        createdAt: date({ seed: i, days: 25, refDate: new Date() }),
        categoryId: category.id,
        amount: i * 100,
    }));
    const sum = transactions.reduce((acc, { amount }) => acc + amount, 0);
    await db.financeAccount.update({ balance: sum }, account.id);
    await page.goto();

    await page.expect("root").toMatchAriaSnapshot({ name: "account-tab-before-updating-transaction" });
    await page.click("transactionEditButtons", { nth: 0 });
    await page.completeTransactionUpsertForm();

    await page.expect("transactionCards").toHaveCount(10);
    await page.expect("root").toMatchAriaSnapshot({ name: "account-tab-after-updating-transaction" });
});
