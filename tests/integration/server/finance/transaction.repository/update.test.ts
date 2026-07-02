import TransactionRepository from "~~/server/finance/repositories/transaction.repository";
import { BASE_TRANSACTION } from "~~/test-utils/constants/finance";
import { expect, test } from "~~/test-utils/vitest";

let id = "";
test.beforeEach(async ({ db, user }) => {
    const [account] = await db.financeAccount.insert(1, { userId: user.id });
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    [{ id }] = await db.financeTransaction.insert(1, { accountId: account.id, categoryId: category.id });
});

test("throws an error when the input data is faulty", async ({ db, user }) => {
    const accountRepository = new TransactionRepository(db.client);
    await expect(accountRepository.update(id, user.id, "" as never)).rejects.toThrow();
});

test("returns 0 when the given account id doesn't exist", async ({ db, user }) => {
    const accountRepository = new TransactionRepository(db.client);
    const rows = await accountRepository.update("bananas", user.id, { ...BASE_TRANSACTION, categoryId: "" });
    expect(rows).toBe(0);
});

test("returns 0 when the given user id doesn't exist", async ({ db }) => {
    const accountRepository = new TransactionRepository(db.client);
    const rows = await accountRepository.update(id, "bananas", { ...BASE_TRANSACTION, categoryId: "" });
    expect(rows).toBe(0);
});
