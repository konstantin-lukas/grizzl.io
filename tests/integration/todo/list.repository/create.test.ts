import ListRepository from "~~/server/todo/repositories/list.repository";
import { BASE_LIST } from "~~/test-utils/constants/todo";
import { expect, test } from "~~/test-utils/vitest";

test("creates an account and returns the id of the created account", async ({ db, user }) => {
    const listRepository = new ListRepository(db.client);
    const id = await listRepository.create(user.id, BASE_LIST);

    const [list] = await db.todoList.select(id);

    expect(list!.id).toBe(id);
    expect(list).toHaveProperty("id", id);
    expect(list).toHaveProperty("title", BASE_LIST.title);
    expect(list).toHaveProperty("userId", user.id);
    expect(list).toHaveProperty("icon", BASE_LIST.icon);
    expect(list).toHaveProperty("deletedAt", null);
    expect(list).toHaveProperty("createdAt", expect.any(Date));
});

test("throws an error when the input data is faulty", async ({ db, user }) => {
    const listRepository = new ListRepository(db.client);
    await expect(listRepository.create(user.id, "" as never)).rejects.toThrow();
});
