import { expect, test } from "~~/test-utils/vitest";

test("deletes all associated resources of a todo list when the list is deleted", async ({ db, user }) => {
    const [list] = await db.todoList.insert(1, { userId: user.id });
    await db.todoListItem.insert(1, { listId: list.id });
    await db.todoPreset.insert(1, { listId: list.id });

    await db.todoList.delete();

    const [listItems, presets] = await Promise.all([db.todoListItem.select(), db.todoPreset.select()]);

    expect(listItems).toHaveLength(0);
    expect(presets).toHaveLength(0);
});
