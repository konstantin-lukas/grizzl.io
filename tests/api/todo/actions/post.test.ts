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
    item.listId = list.id;
});

test("returns a 400 error when the user submits an empty list of actions", async ({ request }) => {
    const response = await request.post("/api/todo/actions", { data: [] });
    expect(response.status()).toBe(400);
});

test("returns a 400 error when the user submits a list of actions that's too long", async ({ request }) => {
    const response = await request.post("/api/todo/actions", { data: Array.from({ length: 21 }).map(() => item) });
    expect(response.status()).toBe(400);
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
