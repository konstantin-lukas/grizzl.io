import { expect, test } from "@@/test-utils/vitest";
import AccountRepository from "~~/server/finance/repositories/account.repository";

test("updates an account's balance", async ({ db, user }) => {
    const newBalance = 123;
    const [account] = await db.financeAccount.insert(1, { userId: user.id });
    const accountRepository = new AccountRepository(db.client);
    await accountRepository.updateBalance(account.id, newBalance);
    const [updatedAccount] = await db.financeAccount.select(account.id);
    expect(updatedAccount?.balance).toBe(newBalance);
});
