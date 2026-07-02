import PresetRepository from "server/todo/repositories/preset.repository";
import { expect, test } from "test-utils/vitest";

test("returns an empty array when the user id doesn't exist", async ({ db, user }) => {
    const [list] = await db.todoList.insert(1, { userId: user.id });
    await db.todoPreset.insert(1, { listId: list.id });
    const presetRepository = new PresetRepository(db.client);
    const lists = await presetRepository.findByUserAndListId("bananas", list.id);
    expect(lists).toHaveLength(0);
});

test("returns an empty array when the list id doesn't exist", async ({ db, user }) => {
    const [list] = await db.todoList.insert(1, { userId: user.id });
    await db.todoPreset.insert(1, { listId: list.id });
    const presetRepository = new PresetRepository(db.client);
    const lists = await presetRepository.findByUserAndListId(user.id, "Bananas");
    expect(lists).toHaveLength(0);
});

test("returns a list of presets belonging to a list", async ({ db, user }) => {
    const [list] = await db.todoList.insert(1, { userId: user.id });
    const [preset] = await db.todoPreset.insert(1, { listId: list.id });
    const presetRepository = new PresetRepository(db.client);
    const lists = await presetRepository.findByUserAndListId(user.id, list.id);
    expect(lists).toStrictEqual([
        {
            id: preset.id,
            items: preset.items,
            title: preset.title,
        },
    ]);
});

test("does not return presets belonging to a different list", async ({ db, user }) => {
    const [list1, list2] = await db.todoList.insert(2, { userId: user.id });
    await db.todoPreset.insert(1, { listId: list1.id });
    const presetRepository = new PresetRepository(db.client);
    const lists = await presetRepository.findByUserAndListId(user.id, list2.id);
    expect(lists).toHaveLength(0);
});

test("does not return presets belonging to a soft-deleted list", async ({ db, user }) => {
    const [list] = await db.todoList.insert(1, { userId: user.id, deletedAt: new Date() });
    await db.todoPreset.insert(1, { listId: list.id });
    const presetRepository = new PresetRepository(db.client);
    const lists = await presetRepository.findByUserAndListId(user.id, list.id);
    expect(lists).toHaveLength(0);
});

test("does not return soft-deleted presets", async ({ db, user }) => {
    const [list] = await db.todoList.insert(1, { userId: user.id });
    await db.todoPreset.insert(1, { listId: list.id, deletedAt: new Date() });
    const presetRepository = new PresetRepository(db.client);
    const lists = await presetRepository.findByUserAndListId(user.id, list.id);
    expect(lists).toHaveLength(0);
});

test("sorts returned presets by their title", async ({ db, user }) => {
    const [list] = await db.todoList.insert(1, { userId: user.id });
    await db.todoPreset.insert(3, index => ({ listId: list.id, title: (3 - index).toString() }));
    const presetRepository = new PresetRepository(db.client);
    const lists = await presetRepository.findByUserAndListId(user.id, list.id);
    expect(lists[0]).toHaveProperty("title", "1");
    expect(lists[1]).toHaveProperty("title", "2");
    expect(lists[2]).toHaveProperty("title", "3");
});
