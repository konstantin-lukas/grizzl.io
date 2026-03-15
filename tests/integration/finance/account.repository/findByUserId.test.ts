import AccountRepository from "~~/server/finance/repositories/account.repository";
import { expect, test } from "~~/test-utils/vitest";
import { anyId } from "~~/test-utils/vitest/patterns";

test("returns only the accounts belonging to the requested user", async ({ db, user }) => {
    const [otherUser] = await db.user.insert(1, { name: "Smithers", email: "smithers@burns.com" });
    await db.financeAccount.insert(5, { userId: otherUser.id });

    const accountRepository = new AccountRepository(db.client);
    await db.financeAccount.insert(2, { userId: user.id });
    const accounts = await accountRepository.findByUserId(user.id);
    expect(accounts).toStrictEqual([
        {
            createdAt: new Date("2025-05-18T01:18:19.000Z"),
            id: anyId,
            title: "lobortispellentesquetortorvolutpataliquamlectusvivamusvoluptatequisquesollicitudinnisiaeneanfaucibus",
            currency: "EUR",
            balance: 0,
        },
        {
            createdAt: new Date("2025-01-23T02:17:18.000Z"),
            id: anyId,
            title: "vitaelobortispellentesquetortorvolutpataliquamlectusvivamusvoluptatequisquesollicitudinnisiaeneanfau",
            currency: "EUR",
            balance: 0,
        },
    ]);
});

test("returns an empty array when the user id doesn't exist", async ({ db }) => {
    const accountRepository = new AccountRepository(db.client);
    const accounts = await accountRepository.findByUserId("bananas");
    expect(accounts).toHaveLength(0);
});

test("returns an empty array when no accounts exist for the given user id", async ({ db, user }) => {
    const accountRepository = new AccountRepository(db.client);
    const accounts = await accountRepository.findByUserId(user.id);
    expect(accounts).toHaveLength(0);
});
