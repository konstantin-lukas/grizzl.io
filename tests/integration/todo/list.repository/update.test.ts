import ListRepository from "~~/server/todo/repositories/list.repository";
import { BASE_LIST } from "~~/test-utils/constants/todo";
import { expect, test } from "~~/test-utils/vitest";

let id = "";
test.beforeEach(async ({ db, user }) => {
    [{ id }] = await db.todoList.insert(5, { userId: user.id });
});

test("throws an error when the input data is faulty", async ({ db, user }) => {
    const listRepository = new ListRepository(db.client);
    await expect(listRepository.update(id, user.id, "" as never)).rejects.toThrow();
});

test("returns 0 when the given list id doesn't exist", async ({ db, user }) => {
    const listRepository = new ListRepository(db.client);
    const rows = await listRepository.update("bananas", user.id, BASE_LIST);
    expect(rows).toBe(0);
});

test("returns 0 when the given user id doesn't exist", async ({ db }) => {
    const listRepository = new ListRepository(db.client);
    const rows = await listRepository.update(id, "bananas", BASE_LIST);
    expect(rows).toBe(0);
});
