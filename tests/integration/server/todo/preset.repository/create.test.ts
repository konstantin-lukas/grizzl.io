import PresetRepository from "~~/server/todo/repositories/preset.repository";
import { expect, test } from "~~/test-utils/vitest";

test("creates a preset and returns the id of the created preset", async ({ db, user }) => {
    const [list] = await db.todoList.insert(1, { userId: user.id });

    const presetRepository = new PresetRepository(db.client);
    const items = ["Bananas", "Oranges"];
    const title = "Fruit";
    const id = await presetRepository.create(list.id, { items, title });

    const [preset] = await db.todoPreset.select();
    expect(preset).toStrictEqual({ items, title, id, listId: list.id, deletedAt: null, createdAt: expect.any(Date) });
});

test("throws an error when the input data is faulty", async ({ db }) => {
    const presetRepository = new PresetRepository(db.client);
    await expect(presetRepository.create("Bananas", { items: [], title: "" })).rejects.toThrow();
});
