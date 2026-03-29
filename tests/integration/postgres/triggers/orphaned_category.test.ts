import { expect, test } from "~~/test-utils/vitest";

test("deletes a category if there are no more (auto) transactions referencing it", async ({ db, user }) => {
    const [account] = await db.financeAccount.insert(1, { userId: user.id });
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    await db.financeTransaction.insert(1, { accountId: account.id, categoryId: category.id });
    await db.financeAutoTransaction.insert(1, { accountId: account.id, categoryId: category.id });

    await db.financeTransaction.delete();
    let categories = await db.financeCategory.select();
    expect(categories).toHaveLength(1);

    await db.financeAutoTransaction.delete();
    categories = await db.financeCategory.select();
    expect(categories).toHaveLength(0);
});
