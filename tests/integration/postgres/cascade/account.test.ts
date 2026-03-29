import { expect, test } from "~~/test-utils/vitest";

test("deletes all associated resources of an account when the account is deleted", async ({ db, user }) => {
    const [account] = await db.financeAccount.insert(1, { userId: user.id });
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    await db.financeTransaction.insert(1, { accountId: account.id, categoryId: category.id });
    await db.financeAutoTransaction.insert(1, { accountId: account.id, categoryId: category.id });

    await db.financeAccount.delete();

    const categories = await db.financeCategory.select();
    const transactions = await db.financeTransaction.select();
    const autoTransactions = await db.financeTransaction.select();

    expect(categories).toHaveLength(0);
    expect(transactions).toHaveLength(0);
    expect(autoTransactions).toHaveLength(0);
});
