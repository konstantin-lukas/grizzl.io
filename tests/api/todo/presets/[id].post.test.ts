import { expect, test } from "~~/test-utils/playwright";

test("returns a 404 error when the action is unknown", async ({ request, db }) => {
    const [list] = await db.todoList.insert(1);
    const [preset] = await db.todoPreset.insert(1, { listId: list.id });
    const response = await request.post(`/api/todo/lists/${list.id}/presets/${preset.id}:move`);
    expect(response.status()).toBe(404);
});

test("returns a 404 error when multiple actions are declared", async ({ request, db }) => {
    const [list] = await db.todoList.insert(1);
    const [preset] = await db.todoPreset.insert(1, { listId: list.id });
    const response = await request.post(`/api/todo/lists/${list.id}/presets/${preset.id}:apply:apply`);
    expect(response.status()).toBe(404);
});

test("returns a 404 error when the list does not exist", async ({ request, db }) => {
    const [list] = await db.todoList.insert(1);
    const [preset] = await db.todoPreset.insert(1, { listId: list.id });
    const response = await request.post(`/api/todo/lists/2222222222222222/presets/${preset.id}:apply`);
    expect(response.status()).toBe(404);
});

test("returns a 404 error when preset belongs to a different list", async ({ request, db }) => {
    const [list1, list2] = await db.todoList.insert(2);
    const [preset] = await db.todoPreset.insert(1, { listId: list1.id });
    const response = await request.post(`/api/todo/lists/${list2.id}/presets/${preset.id}:apply`);
    expect(response.status()).toBe(404);
});

test("returns a 404 error when the list belongs to a different user", async ({ request, db }) => {
    const user = await db.user.selectByEmail("cmontgomeryburns@springfieldnuclear.com");
    const [list] = await db.todoList.insert(1, { userId: user?.id });
    const [preset] = await db.todoPreset.insert(1, { listId: list.id });
    const response = await request.post(`/api/todo/lists/${list.id}/presets/${preset.id}:apply`);
    expect(response.status()).toBe(404);
});

test("returns a 409 error when the resulting list would be too long", async ({ request, db }) => {
    const [list] = await db.todoList.insert(1);
    await db.todoListItem.insert(999, { listId: list.id });
    const [preset] = await db.todoPreset.insert(1, { listId: list.id, items: ["A", "B"] });
    const response = await request.post(`/api/todo/lists/${list.id}/presets/${preset.id}:apply`);
    expect(response.status()).toBe(409);
});

test("returns a 204 when there are no errors", async ({ request, db }) => {
    const [list] = await db.todoList.insert(1);
    const [preset] = await db.todoPreset.insert(1, { listId: list.id });
    const response = await request.post(`/api/todo/lists/${list.id}/presets/${preset.id}:apply`);
    expect(response.status()).toBe(204);
});
