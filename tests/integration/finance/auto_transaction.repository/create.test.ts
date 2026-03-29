import AutoTransactionRepository from "~~/server/finance/repositories/auto_transaction.repository";
import { BASE_AUTO_TRANSACTION } from "~~/test-utils/constants/finance";
import { expect, test } from "~~/test-utils/vitest";
import { anyId } from "~~/test-utils/vitest/patterns";

test("creates an auto-transaction and returns the id of the created resource", async ({ db, user }) => {
    const [account] = await db.financeAccount.insert(1, { userId: user.id });
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    const autoTransactionRepository = new AutoTransactionRepository(db.client);
    const id = await autoTransactionRepository.create(account.id, {
        ...BASE_AUTO_TRANSACTION,
        categoryId: category.id,
    });

    const [transaction] = await db.financeAutoTransaction.select(id);
    const { category: _, ...rest } = BASE_AUTO_TRANSACTION;
    expect(transaction).toStrictEqual({
        ...rest,
        id: anyId,
        accountId: anyId,
        createdAt: expect.any(Date),
        deletedAt: null,
        categoryId: category.id,
    });
});
