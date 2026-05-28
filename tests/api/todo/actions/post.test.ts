import { nanoid } from "#shared/core/utils/id.util";
import { expect, test } from "~~/test-utils/playwright";

const item = {
    action: "create",
    id: "2222222222222222",
    index: 0,
    listId: "",
    text: "Bananas",
};

test.beforeEach(async ({ db }) => {
    const [list] = await db.todoList.insert(1);
    item.id = "2222222222222222";
    item.listId = list.id;
});

test("returns a 400 error when the user submits an empty list of actions", async ({ request }) => {
    const response = await request.post("/api/todo/actions", { data: [] });
    expect(response.status()).toBe(400);
});

test("returns a 400 error when the provided id is invalid", async ({ request }) => {
    const response = await request.post("/api/todo/actions", { data: [{ ...item, id: "123" }] });
    expect(response.status()).toBe(400);
});

test("returns a 400 error when the user submits a list of actions that's too long", async ({ request }) => {
    const response = await request.post("/api/todo/actions", { data: Array.from({ length: 21 }).map(() => item) });
    expect(response.status()).toBe(400);
});

test("returns a 400 error when the index is negative", async ({ request }) => {
    const response = await request.post("/api/todo/actions", { data: [{ ...item, index: -1 }] });
    expect(response.status()).toBe(400);
});

test("returns a 409 error when the index is out of bounds", async ({ request }) => {
    const response = await request.post("/api/todo/actions", { data: [{ ...item, index: 1 }] });
    expect(response.status()).toBe(409);
});

test("returns a 204 status when the amount of actions is just short enough", async ({ request }) => {
    const response = await request.post("/api/todo/actions", {
        data: Array.from({ length: 20 }).map(() => ({ ...item, id: nanoid() })),
    });
    expect(response.status()).toBe(204);
});

test("returns a 204 status when the amount of actions is just long enough", async ({ request }) => {
    const response = await request.post("/api/todo/actions", {
        data: [item],
    });
    expect(response.status()).toBe(204);
});

test("returns a 409 error trying to create two items with the same id", async ({ request }) => {
    const response = await request.post("/api/todo/actions", {
        data: [item, item],
    });
    expect(response.status()).toBe(409);
});

test("returns a 409 error when trying to create new items on a full list", async ({ request, db }) => {
    await db.todoListItem.insert(998, { listId: item.listId });
    const response = await request.post("/api/todo/actions", {
        data: [
            { ...item, id: nanoid(), listId: item.listId },
            { ...item, id: nanoid(), listId: item.listId },
            { ...item, id: nanoid(), listId: item.listId },
        ],
    });
    expect(response.status()).toBe(409);
});

test("returns a 409 error when trying to create two items with index null whose text resolves to the same string when trimmed", async ({
    request,
}) => {
    const response = await request.post("/api/todo/actions", {
        data: [
            { ...item, id: nanoid(), listId: item.listId, index: null, text: " abc" },
            { ...item, id: nanoid(), listId: item.listId, index: null, text: "abc " },
        ],
    });
    expect(response.status()).toBe(409);
});

test("trims changes before saving them", async ({ request, db }) => {
    const [task] = await db.todoListItem.insert(1, { listId: item.listId });
    await request.post("/api/todo/actions", {
        data: [{ ...item, id: task.id, action: "change", value: " abc " }],
    });
    const tasks = await db.todoListItem.select();
    expect(tasks).toHaveLength(1);
    expect(tasks[0]!.text).toBe("abc");
});
