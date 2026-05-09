import { expect, test } from "~~/test-utils/vitest";

test("does not allow creating multiple items with the same text on the same list", async ({ db, user }) => {
    const [list] = await db.todoList.insert(1, { userId: user.id });
    await db.todoListItem.insert(1, { listId: list.id, index: 1 });
    const secondInsert = db.todoListItem.insert(1, { listId: list.id });

    expect(secondInsert).rejects.toThrow();
});

test("does not allow creating multiple items with the same index on the same list", async ({ db, user }) => {
    const [list] = await db.todoList.insert(1, { userId: user.id });
    await db.todoListItem.insert(1, { listId: list.id, text: "Bananas" });
    const secondInsert = db.todoListItem.insert(1, { listId: list.id });

    expect(secondInsert).rejects.toThrow();
});

test("allows creating items with the same text and index on different accounts", async ({ db, user }) => {
    const [list1, list2] = await db.todoList.insert(2, { userId: user.id });
    const insert1 = db.todoListItem.insert(1, { listId: list1.id });
    const insert2 = db.todoListItem.insert(1, { listId: list2.id });

    expect(insert1).resolves.not.toThrow();
    expect(insert2).resolves.not.toThrow();
});
