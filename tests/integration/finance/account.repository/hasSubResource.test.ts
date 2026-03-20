import AccountRepository from "~~/server/finance/repositories/account.repository";
import { expect, test } from "~~/test-utils/vitest";

test("returns true iff the sub resource exists for the given account", async ({ db, user }) => {
    const [account] = await db.financeAccount.insert(1, { userId: user.id });
    const [transaction] = await db.financeTransaction.insert(1, { accountId: account.id });
    const accountRepository = new AccountRepository(db.client);
    const hasTransaction = await accountRepository.hasSubResource(
        transaction.id,
        user.id,
        account.id,
        "financeTransaction",
    );
    const hasAutoTransaction = await accountRepository.hasSubResource(
        transaction.id,
        user.id,
        account.id,
        "financeAutoTransaction",
    );
    expect(hasTransaction).toBe(true);
    expect(hasAutoTransaction).toBe(false);
});
