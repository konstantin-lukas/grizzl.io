import { test } from "~~/test-utils/playwright";

test.beforeEach(async ({ db }) => {
    await db.financeAccount.insert(1);
});

test("automatically updates the account tab content when add or deleting a transaction", async ({
    financePage: page,
}) => {
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
});
