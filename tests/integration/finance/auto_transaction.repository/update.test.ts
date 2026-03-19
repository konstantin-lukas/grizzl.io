import AutoTransactionRepository from "~~/server/finance/repositories/auto_transaction.repository";
import { BASE_AUTO_TRANSACTION } from "~~/test-utils/constants/finance";
import { expect, test } from "~~/test-utils/vitest";

let id = "";
test.beforeEach(async ({ db, user }) => {
    const [account] = await db.financeAccount.insert(1, { userId: user.id });
    [{ id }] = await db.financeAutoTransaction.insert(1, { accountId: account.id });
});

test("throws an error if the input data is faulty", async ({ db, user }) => {
    const accountRepository = new AutoTransactionRepository(db.client);
    await expect(accountRepository.update(id, user.id, "" as never)).rejects.toThrow();
});

test("returns 0 when the given account id doesn't exist", async ({ db, user }) => {
    const accountRepository = new AutoTransactionRepository(db.client);
    const rows = await accountRepository.update("bananas", user.id, BASE_AUTO_TRANSACTION);
    expect(rows).toBe(0);
});

test("returns 0 when the given user id doesn't exist", async ({ db }) => {
    const accountRepository = new AutoTransactionRepository(db.client);
    const rows = await accountRepository.update(id, "bananas", BASE_AUTO_TRANSACTION);
    expect(rows).toBe(0);
});
