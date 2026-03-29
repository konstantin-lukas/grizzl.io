import AutoTransactionRepository from "~~/server/finance/repositories/auto_transaction.repository";
import { expect, test } from "~~/test-utils/vitest";
import { anyId } from "~~/test-utils/vitest/patterns";

test("returns only the accounts belonging to the requested user", async ({ db, user }) => {
    const [otherUser] = await db.user.insert(1, { name: "Smithers", email: "smithers@burns.com" });
    const [otherAccount] = await db.financeAccount.insert(1, { userId: otherUser.id });
    const [otherCategory] = await db.financeCategory.insert(1, { accountId: otherAccount.id });
    await db.financeAutoTransaction.insert(1, { accountId: otherAccount.id, categoryId: otherCategory.id });

    const autoTransactionRepository = new AutoTransactionRepository(db.client);
    const [account] = await db.financeAccount.insert(1, { userId: user.id });
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    await db.financeAutoTransaction.insert(1, { accountId: account.id, categoryId: category.id });
    const autoTransactions = await autoTransactionRepository.findByUserAndAccountId(user.id, account.id);
    expect(autoTransactions).toStrictEqual([
        {
            id: anyId,
            amount: 7977,
            category: {
                name: category.displayName,
                icon: category.icon,
                id: category.id,
            },
            createdAt: new Date("2025-05-18T01:18:19.000Z"),
            execInterval: 8,
            execOn: 28,
            lastExec: "2025-01-23",
            reference:
                "potentivoluptatemolestieullamcoenimeuismodsintirureelitestlectusconsectetuerduiplaceratpraesentutsod",
        },
    ]);
});

test("returns an empty array when the user id doesn't exist", async ({ db, user }) => {
    const [account] = await db.financeAccount.insert(1, { userId: user.id });
    const autoTransactionRepository = new AutoTransactionRepository(db.client);
    const autoTransactions = await autoTransactionRepository.findByUserAndAccountId("bananas", account.id);
    expect(autoTransactions).toHaveLength(0);
});

test("returns an empty array when the account id doesn't exist", async ({ db, user }) => {
    const autoTransactionRepository = new AutoTransactionRepository(db.client);
    const autoTransactions = await autoTransactionRepository.findByUserAndAccountId(user.id, "bananas");
    expect(autoTransactions).toHaveLength(0);
});
