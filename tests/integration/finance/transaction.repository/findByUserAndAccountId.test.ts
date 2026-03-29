import TransactionRepository from "~~/server/finance/repositories/transaction.repository";
import { generateFilterCombinations } from "~~/test-utils/helpers/object";
import { sortByCreatedAt } from "~~/test-utils/helpers/sort";
import { expect, test } from "~~/test-utils/vitest";
import { anyId } from "~~/test-utils/vitest/patterns";

test("returns only the transactions belonging to the requested user", async ({ db, user }) => {
    const [otherUser] = await db.user.insert(1, { name: "Smithers", email: "smithers@burns.com" });
    const [otherAccount] = await db.financeAccount.insert(1, { userId: otherUser.id });
    const [otherCategory] = await db.financeCategory.insert(1, { accountId: otherAccount.id });
    await db.financeTransaction.insert(5, { accountId: otherAccount.id, categoryId: otherCategory.id });

    const [myAccount] = await db.financeAccount.insert(1, { userId: user.id });
    const [myCategory] = await db.financeCategory.insert(1, { accountId: myAccount.id });
    await db.financeTransaction.insert(1, { accountId: myAccount.id, categoryId: myCategory.id });

    const transactionRepository = new TransactionRepository(db.client);
    const accounts = await transactionRepository.findByUserAndAccountId(user.id, myAccount.id);
    expect(accounts).toStrictEqual([
        {
            amount: -27339,
            category: {
                id: myCategory.id,
                icon: myCategory.icon,
                name: myCategory.displayName,
            },
            createdAt: new Date("2025-01-23T02:17:18.000Z"),
            id: anyId,
            reference:
                "potentivoluptatemolestieullamcoenimeuismodsintirureelitestlectusconsectetuerduiplaceratpraesentutsod",
        },
    ]);
});

test("returns an empty array when the user or account id doesn't exist", async ({ db, user }) => {
    const [account] = await db.financeAccount.insert(1, { userId: user.id });
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    await db.financeTransaction.insert(5, { accountId: account.id, categoryId: category.id });

    const transactionRepository = new TransactionRepository(db.client);
    expect(await transactionRepository.findByUserAndAccountId("bananas", account.id)).toHaveLength(0);
    expect(await transactionRepository.findByUserAndAccountId(user.id, "bananas")).toHaveLength(0);
});

test("returns an empty array when no transactions exist for the given user or account id", async ({ db, user }) => {
    const [account] = await db.financeAccount.insert(1, { userId: user.id });

    const transactionRepository = new TransactionRepository(db.client);
    expect(await transactionRepository.findByUserAndAccountId(user.id, account.id)).toHaveLength(0);
});

const filters = generateFilterCombinations([
    { from: new Date("2024-07-24T12:00:00Z") },
    { to: new Date("2025-03-25T12:00:00Z") },
    { reference: "labore" },
    { category: true },
]).map(testCase => ({
    title: Object.keys(testCase).join(", "),
    ...testCase,
}));

test.for(filters)("returns an array filtered by $title", async ({ from, to, reference, category }, { db, user }) => {
    const [account] = await db.financeAccount.insert(1, { userId: user.id });
    const categories = await db.financeCategory.insert(5, { accountId: account.id });
    const data = await db.financeTransaction.insert(50, index => ({
        accountId: account.id,
        categoryId: categories[index % categories.length]!.id,
    }));

    const categoryId = category ? categories[0].id : undefined;

    sortByCreatedAt(data, "desc");
    let remainingData = data as (typeof data)[0][];

    if (from) {
        remainingData = remainingData.filter(datum => new Date(datum.createdAt).getTime() >= new Date(from).getTime());
    }
    if (to) {
        remainingData = remainingData.filter(datum => new Date(datum.createdAt).getTime() <= new Date(to).getTime());
    }
    if (reference) {
        remainingData = remainingData.filter(datum => datum.reference?.includes(reference));
    }
    if (category) {
        remainingData = remainingData.filter(datum => datum.categoryId === categoryId);
    }

    const transactionRepository = new TransactionRepository(db.client);
    const transactions = (
        await transactionRepository.findByUserAndAccountId(user.id, account.id, {
            from,
            to,
            reference,
            categoryId,
        })
    ).map(({ category, ...rest }) => ({ ...rest, categoryId: category.id }));
    expect(transactions).toStrictEqual(remainingData.map(({ accountId, deletedAt, ...rest }) => rest));
});
