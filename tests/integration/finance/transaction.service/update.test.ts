import AccountRepository from "~~/server/finance/repositories/account.repository";
import TransactionRepository from "~~/server/finance/repositories/transaction.repository";
import TransactionService from "~~/server/finance/services/transaction.service";
import { BASE_TRANSACTION } from "~~/test-utils/constants/finance";
import { arr } from "~~/test-utils/helpers/data";
import { expect, test } from "~~/test-utils/vitest";

test("correctly calculates the account balance when multiple updates happens simultaneously", async ({ db, user }) => {
    const accountRepository = new AccountRepository(db.client);
    const transactionRepository = new TransactionRepository(db.client);
    const transactionService = new TransactionService(transactionRepository, accountRepository);

    const [account] = await db.financeAccount.insert(1, { userId: user.id });
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    const transactions = await db.financeTransaction.insert(50, {
        accountId: account.id,
        categoryId: category.id,
        amount: 0,
    });
    await Promise.all(
        arr(
            index =>
                transactionService.update(transactions[index]!.id, user.id, account.id, {
                    ...BASE_TRANSACTION,
                    amount: BASE_TRANSACTION.amount,
                }),
            {
                length: transactions.length,
            },
        ),
    );

    const [updatedAccount] = await db.financeAccount.select(account.id);
    expect(updatedAccount!.balance).toBe(BASE_TRANSACTION.amount * 50);
});
