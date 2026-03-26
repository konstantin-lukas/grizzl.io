import AutoTransactionRepository from "~~/server/finance/repositories/auto_transaction.repository";
import { expect, test } from "~~/test-utils/vitest";

test("deletes only resources owned by the user", async ({ db, user }) => {
    const transactionRepository = new AutoTransactionRepository(db.client);
    await db.user.insert(1, { email: "test" });
    const otherUser = await db.user.selectByEmail("test" as never);
    const [account1] = await db.financeAccount.insert(1, { userId: user.id });
    const [category1] = await db.financeCategory.insert(1, { accountId: account1.id });
    const [account2] = await db.financeAccount.insert(1, { userId: otherUser!.id });
    const [category2] = await db.financeCategory.insert(1, { accountId: account2.id });

    const [autoTransaction1] = await db.financeAutoTransaction.insert(1, {
        accountId: account1.id,
        categoryId: category1.id,
    });
    const [autoTransaction2] = await db.financeAutoTransaction.insert(1, {
        accountId: account2.id,
        categoryId: category2.id,
    });

    await transactionRepository.delete({ id: autoTransaction1.id, userId: user.id });
    await transactionRepository.delete({ id: autoTransaction2.id, userId: user.id });

    const deletedTransactions = (await db.financeAutoTransaction.select()).filter(
        transaction => transaction.deletedAt !== null,
    );

    expect(deletedTransactions).toHaveLength(1);
    expect(deletedTransactions[0]!.id).toBe(autoTransaction1.id);
});
