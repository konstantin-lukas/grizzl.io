import AccountRepository from "~~/server/finance/repositories/account.repository";
import { BASE_ACCOUNT } from "~~/test-utils/constants/finance";
import { expect, test } from "~~/test-utils/vitest";

let id = "";
test.beforeEach(async ({ db, user }) => {
    [{ id }] = await db.financeAccount.insert(5, { userId: user.id });
});

test("throws an error if the input data is faulty", async ({ db, user }) => {
    const accountRepository = new AccountRepository(db.client);
    await expect(accountRepository.update(id, user.id, "" as never)).rejects.toThrow();
});

test("returns 0 when the given account id doesn't exist", async ({ db, user }) => {
    const accountRepository = new AccountRepository(db.client);
    const rows = await accountRepository.update("bananas", user.id, BASE_ACCOUNT);
    expect(rows).toBe(0);
});

test("returns 0 when the given user id doesn't exist", async ({ db }) => {
    const accountRepository = new AccountRepository(db.client);
    const rows = await accountRepository.update(id, "bananas", BASE_ACCOUNT);
    expect(rows).toBe(0);
});
