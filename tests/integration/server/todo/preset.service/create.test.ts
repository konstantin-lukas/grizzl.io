import NotFoundError from "~~/server/core/errors/not-found.error";
import ListItemRepository from "~~/server/todo/repositories/list-item.repository";
import ListRepository from "~~/server/todo/repositories/list.repository";
import PresetRepository from "~~/server/todo/repositories/preset.repository";
import PresetService from "~~/server/todo/services/preset.service";
import { expect, test } from "~~/test-utils/vitest";

test("creates a preset and returns the id of the created preset", async ({ db, user }) => {
    const [list] = await db.todoList.insert(1, { userId: user.id });

    const presetRepository = new PresetRepository(db.client);
    const listRepository = new ListRepository(db.client);
    const listItemRepository = new ListItemRepository(db.client);
    const presetService = new PresetService(presetRepository, listRepository, listItemRepository);

    const items = ["Bananas", "Oranges"];
    const title = "Fruit";
    const id = await presetService.create(user.id, list.id, { items, title });

    const [preset] = await db.todoPreset.select();
    expect(preset).toStrictEqual({ items, title, id, listId: list.id, deletedAt: null, createdAt: expect.any(Date) });
});

test("throws a NotFoundError error when the input data is faulty", async ({ db, user }) => {
    const presetRepository = new PresetRepository(db.client);
    const listRepository = new ListRepository(db.client);
    const listItemRepository = new ListItemRepository(db.client);
    const presetService = new PresetService(presetRepository, listRepository, listItemRepository);
    await expect(presetService.create(user.id, "Bananas", { items: [], title: "" })).rejects.toThrow(NotFoundError);
});
