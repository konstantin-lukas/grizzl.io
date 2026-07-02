import AccountRepository from "~~/server/finance/repositories/account.repository";
import { expect, test } from "~~/test-utils/vitest";

test("purging a soft-deleted account automatically removes all associated resources", async ({ db, user }) => {
    const [account] = await db.financeAccount.insert(1, { userId: user.id, deletedAt: new Date() });
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    await db.financeTransaction.insert(1, { accountId: account.id, categoryId: category.id });
    await db.financeAutoTransaction.insert(1, { accountId: account.id, categoryId: category.id });

    const accountRepository = new AccountRepository(db.client);
    const result = await accountRepository.purge({ maxAge: 0 });
    expect(result).toBe(1);

    const categories = await db.financeCategory.select();
    const transactions = await db.financeTransaction.select();
    const autoTransactions = await db.financeAutoTransaction.select();

    expect(categories).toHaveLength(0);
    expect(transactions).toHaveLength(0);
    expect(autoTransactions).toHaveLength(0);
});
