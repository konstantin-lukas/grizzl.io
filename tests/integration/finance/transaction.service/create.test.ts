import AccountService from "#server/finance/services/account.service";
import CategoryService from "#server/finance/services/category.service";
import AccountRepository from "~~/server/finance/repositories/account.repository";
import CategoryRepository from "~~/server/finance/repositories/category.repository";
import TransactionRepository from "~~/server/finance/repositories/transaction.repository";
import TransactionService from "~~/server/finance/services/transaction.service";
import { INTERNAL_TRANSACTION } from "~~/test-utils/constants/finance";
import { arr } from "~~/test-utils/helpers/data";
import { expect, test } from "~~/test-utils/vitest";

test("correctly calculates the account balance when multiple updates happens simultaneously", async ({ db, user }) => {
    const accountRepository = new AccountRepository(db.client);
    const accountService = new AccountService(accountRepository);
    const categoryRepository = new CategoryRepository(db.client);
    const categoryService = new CategoryService(categoryRepository);
    const transactionRepository = new TransactionRepository(db.client);
    const transactionService = new TransactionService(
        transactionRepository,
        accountRepository,
        categoryService,
        accountService,
    );

    const [account] = await db.financeAccount.insert(1, { userId: user.id });
    await Promise.all(
        arr(() => transactionService.create(user.id, account.id, INTERNAL_TRANSACTION), {
            length: 50,
        }),
    );

    const expectedSum = INTERNAL_TRANSACTION.amount * 50;

    const [updatedAccount] = await db.financeAccount.select(account.id);
    expect(updatedAccount?.balance).toBe(expectedSum);
});
