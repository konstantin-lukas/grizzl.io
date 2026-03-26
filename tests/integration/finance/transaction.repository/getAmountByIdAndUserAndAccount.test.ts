import TransactionRepository from "~~/server/finance/repositories/transaction.repository";
import { expect, test } from "~~/test-utils/vitest";

test("returns only the amount of an transaction given the necessary ids", async ({ db, user }) => {
    const [account] = await db.financeAccount.insert(1, { userId: user.id });
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    const [transaction] = await db.financeTransaction.insert(1, {
        accountId: account.id,
        categoryId: category.id,
        amount: 1234,
    });
    const transactionRepository = new TransactionRepository(db.client);
    const amount = await transactionRepository.getAmountByIdAndUserAndAccount(transaction.id, user.id, account.id);

    expect(amount).toBe(transaction.amount);
});
