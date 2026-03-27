import AccountRepository from "~~/server/finance/repositories/account.repository";
import CategoryRepository from "~~/server/finance/repositories/category.repository";
import TransactionRepository from "~~/server/finance/repositories/transaction.repository";
import TransactionService from "~~/server/finance/services/transaction.service";
import { BASE_TRANSACTION } from "~~/test-utils/constants/finance";
import { arr } from "~~/test-utils/helpers/data";
import { expect, test } from "~~/test-utils/vitest";

test("correctly calculates the account balance when multiple updates happens simultaneously", async ({ db, user }) => {
    const accountRepository = new AccountRepository(db.client);
    const transactionRepository = new TransactionRepository(db.client);
    const categoryRepository = new CategoryRepository(db.client);
    const transactionService = new TransactionService(transactionRepository, accountRepository, categoryRepository);

    const [account] = await db.financeAccount.insert(1, { userId: user.id });
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    await Promise.all(
        arr(() => transactionService.create(user.id, account.id, { ...BASE_TRANSACTION, categoryId: category.id }), {
            length: 50,
        }),
    );

    const expectedSum = BASE_TRANSACTION.amount * 50;

    const [updatedAccount] = await db.financeAccount.select(account.id);
    expect(updatedAccount?.balance).toBe(expectedSum);
});
