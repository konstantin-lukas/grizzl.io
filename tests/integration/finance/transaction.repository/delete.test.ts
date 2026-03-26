import TransactionRepository from "~~/server/finance/repositories/transaction.repository";
import { expect, test } from "~~/test-utils/vitest";

test("deletes only resources owned by the user", async ({ db, user }) => {
    const transactionRepository = new TransactionRepository(db.client);
    await db.user.insert(1, { email: "test" });
    const otherUser = await db.user.selectByEmail("test" as never);
    const [category1] = await db.financeCategory.insert(1, { accountId: user.id });
    const [account1] = await db.financeAccount.insert(1, { userId: user.id });
    const [category2] = await db.financeCategory.insert(1, { accountId: otherUser!.id });
    const [account2] = await db.financeAccount.insert(1, { userId: otherUser!.id });

    const [transaction1] = await db.financeTransaction.insert(1, { accountId: account1.id, categoryId: category1.id });
    const [transaction2] = await db.financeTransaction.insert(1, { accountId: account2.id, categoryId: category2.id });

    await transactionRepository.delete({ id: transaction1.id, userId: user.id });
    await transactionRepository.delete({ id: transaction2.id, userId: user.id });

    const deletedTransactions = (await db.financeTransaction.select()).filter(
        transaction => transaction.deletedAt !== null,
    );

    expect(deletedTransactions).toHaveLength(1);
    expect(deletedTransactions[0]!.id).toBe(transaction1.id);
});
