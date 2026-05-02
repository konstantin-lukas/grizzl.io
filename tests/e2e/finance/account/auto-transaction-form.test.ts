import { expect, test } from "~~/test-utils/playwright";

test("creates and executes an auto-transaction immediately if it is today", async ({ financePage: page, db }) => {
    await db.financeAccount.insert(1);
    await page.goto();

    await page.click("autoTransactionMenuButton");
    await page.click("autoTransactionCreateButton");

    const today = new Date().getDate();
    await page.completeAutoTransactionUpsertForm({ execOn: today.toString() });

    await page
        .expect("transactionCards", { nth: 0 })
        .toMatchAriaSnapshot({ name: "automatically-created-transaction" });
});

test("allows editing and deleting auto transactions", async ({ financePage: page, db }) => {
    const [account] = await db.financeAccount.insert(1);
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    const [transaction] = await db.financeAutoTransaction.insert(1, { accountId: account.id, categoryId: category.id });
    await page.goto();

    await page.click("autoTransactionMenuButton");
    await page.click("autoTransactionEditButtons", { nth: 0 });
    await page.completeAutoTransactionUpsertForm();
    await page.expect("closeToastButton").toHaveCount(1);

    const [updatedTransaction] = await db.financeAutoTransaction.select(transaction.id);
    expect(updatedTransaction!.execOn).toBe(1);
    expect(updatedTransaction!.execInterval).toBe(1);
    expect(updatedTransaction!.amount).toBe(10000);

    await page.click("autoTransactionDeleteButtons", { nth: 0 });
    await page.expect("autoTransactionDeleteButtons").toHaveCount(0);
    const transactions = await db.financeAutoTransaction.select(transaction.id);
    for (const t of transactions) {
        expect(t.deletedAt).toBeInstanceOf(Date);
    }
});
