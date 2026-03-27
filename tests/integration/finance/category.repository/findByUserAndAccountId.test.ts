import CategoryRepository from "~~/server/finance/repositories/category.repository";
import { omit } from "~~/test-utils/helpers/object";
import { expect, test } from "~~/test-utils/vitest";

test("returns only the categories belonging to the requested user", async ({ db, user }) => {
    const [otherUser] = await db.user.insert(1, { name: "Smithers", email: "smithers@burns.com" });
    const [otherAccount] = await db.financeAccount.insert(1, { userId: otherUser.id });
    await db.financeCategory.insert(1, { accountId: otherAccount.id });

    const [account] = await db.financeAccount.insert(1, { userId: user.id });
    const [category] = await db.financeCategory.insert(2, i => ({ accountId: i === 0 ? account.id : otherAccount.id }));

    const categoryRepository = new CategoryRepository(db.client);
    const categories = await categoryRepository.findByUserAndAccountId(user.id, account.id);
    expect(categories).toStrictEqual([omit(category, "accountId")]);
});

test("returns an empty array when the user id doesn't exist", async ({ db, user }) => {
    const [account] = await db.financeAccount.insert(1, { userId: user.id });
    const categoryRepository = new CategoryRepository(db.client);
    const categories = await categoryRepository.findByUserAndAccountId("bananas", account.id);
    expect(categories).toHaveLength(0);
});

test("returns an empty array when the account id doesn't exist", async ({ db, user }) => {
    const categoryRepository = new CategoryRepository(db.client);
    const categories = await categoryRepository.findByUserAndAccountId(user.id, "bananas");
    expect(categories).toHaveLength(0);
});
