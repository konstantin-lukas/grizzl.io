import TransactionRepository from "~~/server/finance/repositories/transaction.repository";
import { expect, test } from "~~/test-utils/vitest";

test("sums all matching transaction amounts up to and including the provided date", async ({ db, user }) => {
    const [account] = await db.financeAccount.insert(1, { userId: user.id });
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });

    await db.financeTransaction.insert(1, {
        accountId: account.id,
        categoryId: category.id,
        amount: 100,
        createdAt: new Date("2025-01-10T10:00:00.000Z"),
    });
    await db.financeTransaction.insert(1, {
        accountId: account.id,
        categoryId: category.id,
        amount: -40,
        createdAt: new Date("2025-01-20T00:00:00.000Z"),
    });
    await db.financeTransaction.insert(1, {
        accountId: account.id,
        categoryId: category.id,
        amount: 500,
        createdAt: new Date("2025-01-21T00:00:00.000Z"),
    });

    const transactionRepository = new TransactionRepository(db.client);
    const balance = await transactionRepository.getAccountBalanceUntil(user.id, account.id, {
        to: new Date("2025-01-20T00:00:00.000Z"),
    });

    expect(balance).toBe(60);
});

test("returns 0 when user/account has no matching transactions", async ({ db, user }) => {
    const [account] = await db.financeAccount.insert(1, { userId: user.id });

    const transactionRepository = new TransactionRepository(db.client);

    expect(
        await transactionRepository.getAccountBalanceUntil(user.id, account.id, {
            to: new Date("2025-01-01T00:00:00.000Z"),
        }),
    ).toBe(0);

    expect(
        await transactionRepository.getAccountBalanceUntil("missing-user", account.id, {
            to: new Date("2025-12-31T00:00:00.000Z"),
        }),
    ).toBe(0);

    expect(
        await transactionRepository.getAccountBalanceUntil(user.id, "missing-account", {
            to: new Date("2025-12-31T00:00:00.000Z"),
        }),
    ).toBe(0);
});

test("does not include transactions from other accounts or users", async ({ db, user }) => {
    const [myAccount] = await db.financeAccount.insert(1, { userId: user.id });
    const [myCategory] = await db.financeCategory.insert(1, { accountId: myAccount.id });

    const [otherUser] = await db.user.insert(1, { name: "Other", email: "other@example.com" });
    const [otherAccount] = await db.financeAccount.insert(1, { userId: otherUser.id });
    const [otherCategory] = await db.financeCategory.insert(1, { accountId: otherAccount.id });

    await db.financeTransaction.insert(1, {
        accountId: myAccount.id,
        categoryId: myCategory.id,
        amount: 200,
        createdAt: new Date("2025-01-10T00:00:00.000Z"),
    });

    await db.financeTransaction.insert(1, {
        accountId: otherAccount.id,
        categoryId: otherCategory.id,
        amount: 9999,
        createdAt: new Date("2025-01-10T00:00:00.000Z"),
    });

    const transactionRepository = new TransactionRepository(db.client);
    const balance = await transactionRepository.getAccountBalanceUntil(user.id, myAccount.id, {
        to: new Date("2025-12-31T00:00:00.000Z"),
    });

    expect(balance).toBe(200);
});

test("applies the category filter", async ({ db, user }) => {
    const [account] = await db.financeAccount.insert(1, { userId: user.id });
    const [catA, catB] = await db.financeCategory.insert(2, { accountId: account.id });

    await db.financeTransaction.insert(1, {
        accountId: account.id,
        categoryId: catA.id,
        amount: 100,
        createdAt: new Date("2025-01-10T00:00:00.000Z"),
    });
    await db.financeTransaction.insert(1, {
        accountId: account.id,
        categoryId: catB.id,
        amount: 300,
        createdAt: new Date("2025-01-10T00:00:00.000Z"),
    });

    const transactionRepository = new TransactionRepository(db.client);
    const balance = await transactionRepository.getAccountBalanceUntil(user.id, account.id, {
        to: new Date("2025-12-31T00:00:00.000Z"),
        categoryId: catA.id,
    });

    expect(balance).toBe(100);
});

test("applies the reference filter and escapes wildcard characters", async ({ db, user }) => {
    const [account] = await db.financeAccount.insert(1, { userId: user.id });
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });

    await db.financeTransaction.insert(1, {
        accountId: account.id,
        categoryId: category.id,
        amount: 100,
        reference: "100% legit",
        createdAt: new Date("2025-01-10T00:00:00.000Z"),
    });
    await db.financeTransaction.insert(1, {
        accountId: account.id,
        categoryId: category.id,
        amount: 200,
        reference: "1000 legit",
        createdAt: new Date("2025-01-10T00:00:00.000Z"),
    });
    await db.financeTransaction.insert(1, {
        accountId: account.id,
        categoryId: category.id,
        amount: 300,
        reference: "under_score",
        createdAt: new Date("2025-01-10T00:00:00.000Z"),
    });
    await db.financeTransaction.insert(1, {
        accountId: account.id,
        categoryId: category.id,
        amount: 400,
        reference: "underXscore",
        createdAt: new Date("2025-01-10T00:00:00.000Z"),
    });

    const transactionRepository = new TransactionRepository(db.client);

    const percentMatch = await transactionRepository.getAccountBalanceUntil(user.id, account.id, {
        to: new Date("2025-12-31T00:00:00.000Z"),
        reference: "100%",
    });
    expect(percentMatch).toBe(100);

    const underscoreMatch = await transactionRepository.getAccountBalanceUntil(user.id, account.id, {
        to: new Date("2025-12-31T00:00:00.000Z"),
        reference: "under_score",
    });
    expect(underscoreMatch).toBe(300);
});

test("excludes soft-deleted transactions and soft-deleted accounts", async ({ db, user }) => {
    const [activeAccount] = await db.financeAccount.insert(1, { userId: user.id });
    const [activeCategory] = await db.financeCategory.insert(1, { accountId: activeAccount.id });

    await db.financeTransaction.insert(1, {
        accountId: activeAccount.id,
        categoryId: activeCategory.id,
        amount: 50,
        createdAt: new Date("2025-01-10T00:00:00.000Z"),
    });
    await db.financeTransaction.insert(1, {
        accountId: activeAccount.id,
        categoryId: activeCategory.id,
        amount: 999,
        deletedAt: new Date(),
        createdAt: new Date("2025-01-10T00:00:00.000Z"),
    });

    const [deletedAccount] = await db.financeAccount.insert(1, {
        userId: user.id,
        deletedAt: new Date(),
    });
    const [deletedAccountCategory] = await db.financeCategory.insert(1, { accountId: deletedAccount.id });
    await db.financeTransaction.insert(1, {
        accountId: deletedAccount.id,
        categoryId: deletedAccountCategory.id,
        amount: 777,
        createdAt: new Date("2025-01-10T00:00:00.000Z"),
    });

    const transactionRepository = new TransactionRepository(db.client);

    const activeBalance = await transactionRepository.getAccountBalanceUntil(user.id, activeAccount.id, {
        to: new Date("2025-12-31T00:00:00.000Z"),
    });
    expect(activeBalance).toBe(50);

    const deletedAccountBalance = await transactionRepository.getAccountBalanceUntil(user.id, deletedAccount.id, {
        to: new Date("2025-12-31T00:00:00.000Z"),
    });
    expect(deletedAccountBalance).toBe(0);
});
