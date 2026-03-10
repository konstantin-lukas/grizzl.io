import { expect, test } from "@@/test-utils/vitest";
import AccountRepository from "~~/server/finance/repositories/account.repository";
import { BASE_ACCOUNT } from "~~/test-utils/constants/finance";

test("creates an account and returns the id of the created account", async ({ db, user }) => {
    const accountRepository = new AccountRepository(db.client);
    const id = await accountRepository.create(user.id, BASE_ACCOUNT);

    const [account] = await db.financeAccount.select(id);

    expect(account!.id).toBe(id);
    expect(account).toHaveProperty("id", id);
    expect(account).toHaveProperty("title", BASE_ACCOUNT.title);
    expect(account).toHaveProperty("userId", user.id);
    expect(account).toHaveProperty("currency", BASE_ACCOUNT.currency);
    expect(account).toHaveProperty("balance", 0);
    expect(account).toHaveProperty("deletedAt", null);
    expect(account).toHaveProperty("createdAt", expect.any(Date));
});

test("throws an error if the input data is faulty", async ({ db, user }) => {
    const accountRepository = new AccountRepository(db.client);
    await expect(accountRepository.create(user.id, "" as never)).rejects.toThrow();
});
