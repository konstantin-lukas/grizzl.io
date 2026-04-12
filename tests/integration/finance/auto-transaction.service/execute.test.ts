import AccountRepository from "#server/finance/repositories/account.repository";
import AutoTransactionRepository from "#server/finance/repositories/auto-transaction.repository";
import CategoryRepository from "#server/finance/repositories/category.repository";
import TransactionRepository from "#server/finance/repositories/transaction.repository";
import AccountService from "#server/finance/services/account.service";
import AutoTransactionService from "#server/finance/services/auto-transaction.service";
import CategoryService from "#server/finance/services/category.service";
import type { DBFixtures } from "~~/test-utils/database/fixture";
import { beforeEach, expect, test, vi } from "~~/test-utils/vitest";

beforeEach(() => {
    vi.resetAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-15T12:00:00.000Z"));
});

async function setup(db: DBFixtures, user: { id: string }) {
    const autoTransactionRepository = new AutoTransactionRepository(db.client);
    const accountRepository = new AccountRepository(db.client);
    const categoryRepository = new CategoryRepository(db.client);
    const categoryService = new CategoryService(categoryRepository);
    const accountService = new AccountService(accountRepository);
    const transactionRepository = new TransactionRepository(db.client);

    const service = new AutoTransactionService(
        autoTransactionRepository,
        accountRepository,
        categoryService,
        accountService,
        transactionRepository,
    );

    const [account] = await db.financeAccount.insert(1, { userId: user.id });
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });

    return { service, account, category };
}

test("does not insert transactions when there are no auto transactions", async ({ db, user }) => {
    const { service, account } = await setup(db, user);

    await service.execute(user.id, account.id, "UTC");
    const transactions = await db.financeTransaction.select();

    expect(transactions).toHaveLength(0);
});

test("does not insert transactions for transactions that already happened", async ({ db, user }) => {
    const { service, account, category } = await setup(db, user);
    await db.financeAutoTransaction.insert(1, {
        accountId: account.id,
        categoryId: category.id,
        lastExec: "2026-04-15",
        execInterval: 1,
        execOn: 15,
    });

    await service.execute(user.id, account.id, "UTC");
    const transactions = await db.financeTransaction.select();

    expect(transactions).toHaveLength(0);
});

test("inserts transactions when lastExec is exactly one month ago", async ({ db, user }) => {
    const { service, account, category } = await setup(db, user);
    await db.financeAutoTransaction.insert(1, {
        accountId: account.id,
        categoryId: category.id,
        lastExec: "2026-03-15",
        execInterval: 1,
        execOn: 15,
    });

    await service.execute(user.id, account.id, "UTC");
    const transactions = await db.financeTransaction.select();

    expect(transactions).toHaveLength(1);
});

test("inserts transactions when lastExec is more than one month ago", async ({ db, user }) => {
    const { service, account, category } = await setup(db, user);
    await db.financeAutoTransaction.insert(1, {
        accountId: account.id,
        categoryId: category.id,
        lastExec: "2026-03-14",
        execInterval: 1,
        execOn: 15,
    });

    await service.execute(user.id, account.id, "UTC");
    const transactions = await db.financeTransaction.select();

    expect(transactions).toHaveLength(1);
});

test("does not insert transactions even when lastExec day doesn't match", async ({ db, user }) => {
    const { service, account, category } = await setup(db, user);
    await db.financeAutoTransaction.insert(1, {
        accountId: account.id,
        categoryId: category.id,
        lastExec: "2026-03-16",
        execInterval: 1,
        execOn: 15,
    });

    await service.execute(user.id, account.id, "UTC");
    const transactions = await db.financeTransaction.select();

    expect(transactions).toHaveLength(1);
});

test("creates one transaction for each pending execution", async ({ db, user }) => {
    const { service, account, category } = await setup(db, user);
    const [autoTransaction] = await db.financeAutoTransaction.insert(1, {
        accountId: account.id,
        categoryId: category.id,
        lastExec: "2025-11-20",
        execInterval: 1,
        execOn: 20,
    });

    await service.execute(user.id, account.id, "UTC");
    const transactions = await db.financeTransaction.select();

    const expectedDates = [
        "2025-12-20T00:00:00.000Z",
        "2026-01-20T00:00:00.000Z",
        "2026-02-20T00:00:00.000Z",
        "2026-03-20T00:00:00.000Z",
    ];

    expect(transactions).toHaveLength(4);

    for (const [index, transaction] of transactions.entries()) {
        expect(transaction).toMatchObject({
            amount: autoTransaction.amount,
            reference: autoTransaction.reference,
            accountId: autoTransaction.accountId,
            categoryId: autoTransaction.categoryId,
            createdAt: new Date(expectedDates[index]!),
        });
    }
});

test("creates one transaction for each pending execution when interval is 2", async ({ db, user }) => {
    const { service, account, category } = await setup(db, user);
    const [autoTransaction] = await db.financeAutoTransaction.insert(1, {
        accountId: account.id,
        categoryId: category.id,
        lastExec: "2025-11-20",
        execInterval: 2,
        execOn: 20,
    });

    await service.execute(user.id, account.id, "UTC");
    const transactions = await db.financeTransaction.select();

    const expectedDates = ["2026-01-20T00:00:00.000Z", "2026-03-20T00:00:00.000Z"];

    expect(transactions).toHaveLength(2);

    for (const [index, transaction] of transactions.entries()) {
        expect(transaction).toMatchObject({
            amount: autoTransaction.amount,
            reference: autoTransaction.reference,
            accountId: autoTransaction.accountId,
            categoryId: autoTransaction.categoryId,
            createdAt: new Date(expectedDates[index]!),
        });
    }
});

test("adjusts dates according to the timezone", async ({ db, user }) => {
    const { service, account, category } = await setup(db, user);
    await db.financeAutoTransaction.insert(1, {
        accountId: account.id,
        categoryId: category.id,
        lastExec: "2026-03-15",
        execInterval: 1,
        execOn: 15,
    });

    await service.execute(user.id, account.id, "Europe/Berlin");
    const [transaction] = await db.financeTransaction.select();

    expect(transaction?.createdAt).toEqual(new Date("2026-04-15T00:00:00.000+02:00"));
});

test("executes auto transactions when there are multiple", async ({ db, user }) => {
    const { service, account, category } = await setup(db, user);
    const [at1, at2] = await db.financeAutoTransaction.insert(2, {
        accountId: account.id,
        categoryId: category.id,
        lastExec: "2026-03-15",
        execInterval: 1,
        execOn: 15,
    });

    await service.execute(user.id, account.id, "UTC");
    const transactions = await db.financeTransaction.select();

    expect(transactions).toHaveLength(2);
    expect(transactions[0]).toMatchObject({
        amount: at1.amount,
        reference: at1.reference,
        accountId: at1.accountId,
        categoryId: at1.categoryId,
        createdAt: new Date("2026-04-15T00:00:00.000Z"),
    });
    expect(transactions[1]).toMatchObject({
        amount: at2.amount,
        reference: at2.reference,
        accountId: at2.accountId,
        categoryId: at2.categoryId,
        createdAt: new Date("2026-04-15T00:00:00.000Z"),
    });
});

test("creates one transaction on the last of the month if exec on is 31", async ({ db, user }) => {
    const { service, account, category } = await setup(db, user);
    await db.financeAutoTransaction.insert(1, {
        accountId: account.id,
        categoryId: category.id,
        lastExec: "2025-11-30",
        execInterval: 1,
        execOn: 31,
    });

    await service.execute(user.id, account.id, "UTC");
    const transactions = await db.financeTransaction.select();

    const expectedDates = [
        "2025-12-31T00:00:00.000Z",
        "2026-01-31T00:00:00.000Z",
        "2026-02-28T00:00:00.000Z",
        "2026-03-31T00:00:00.000Z",
    ];

    expect(transactions).toHaveLength(4);

    for (const [index, transaction] of transactions.entries()) {
        expect(transaction?.createdAt).toEqual(new Date(expectedDates[index]!));
    }
});
