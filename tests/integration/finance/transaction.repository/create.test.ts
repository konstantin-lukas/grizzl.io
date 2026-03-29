import TransactionRepository from "~~/server/finance/repositories/transaction.repository";
import { BASE_TRANSACTION } from "~~/test-utils/constants/finance";
import { expect, test } from "~~/test-utils/vitest";
import { anyId } from "~~/test-utils/vitest/patterns";

test("creates a transaction and returns the id of the created resource", async ({ db, user }) => {
    const [account] = await db.financeAccount.insert(1, { userId: user.id });
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    const transactionRepository = new TransactionRepository(db.client);
    const id = await transactionRepository.create(account.id, { ...BASE_TRANSACTION, categoryId: category.id });

    const [transaction] = await db.financeTransaction.select(id);
    expect(transaction).toStrictEqual({
        amount: BASE_TRANSACTION.amount,
        reference: BASE_TRANSACTION.reference,
        id: anyId,
        accountId: anyId,
        createdAt: expect.any(Date),
        deletedAt: null,
        categoryId: category.id,
    });
});
