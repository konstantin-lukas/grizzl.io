import EntityLimitError from "server/core/errors/entity-limit.error";
import NotFoundError from "server/core/errors/not-found.error";
import ListItemRepository from "server/todo/repositories/list-item.repository";
import ListRepository from "server/todo/repositories/list.repository";
import PresetRepository from "server/todo/repositories/preset.repository";
import PresetService from "server/todo/services/preset.service";
import type { DBFixtures } from "test-utils/database/fixture";
import { expect, test } from "test-utils/vitest";

function makePresetService(db: DBFixtures) {
    const presetRepository = new PresetRepository(db.client);
    const listRepository = new ListRepository(db.client);
    const listItemRepository = new ListItemRepository(db.client);
    return new PresetService(presetRepository, listRepository, listItemRepository);
}

test("throws a NotFoundError if the preset doesn't belong to the list", async ({ db, user }) => {
    const [list1, list2] = await db.todoList.insert(2, { userId: user.id });
    const [preset] = await db.todoPreset.insert(1, { listId: list1.id });

    const presetService = makePresetService(db);
    expect(presetService.apply(preset.id, list2.id, user.id)).rejects.toThrow(NotFoundError);
});

test("throws a NotFoundError if the list doesn't belong to the user", async ({ db, user }) => {
    const [list] = await db.todoList.insert(1, { userId: user.id });
    const [preset] = await db.todoPreset.insert(1, { listId: list.id });

    const presetService = makePresetService(db);
    expect(presetService.apply(preset.id, list.id, "Bananas")).rejects.toThrow(NotFoundError);
});

test("throws a NotFoundError if the preset doesn't exist", async ({ db, user }) => {
    const [list] = await db.todoList.insert(1, { userId: user.id });
    await db.todoPreset.insert(1, { listId: list.id });

    const presetService = makePresetService(db);
    expect(presetService.apply("Bananas", list.id, user.id)).rejects.toThrow(NotFoundError);
});

test("throws an EntityLimitError if the resulting list is too long", async ({ db, user }) => {
    const [list] = await db.todoList.insert(1, { userId: user.id });
    await db.todoListItem.insert<number>(1000, { listId: list.id });
    const [preset] = await db.todoPreset.insert(1, { listId: list.id, items: ["A"] });

    const presetService = makePresetService(db);
    expect(presetService.apply(preset.id, list.id, user.id)).rejects.toThrow(EntityLimitError);
});

test("does not throw an EntityLimitError if the resulting list is short enough after deduplication", async ({
    db,
    user,
}) => {
    const [list] = await db.todoList.insert(1, { userId: user.id });
    await db.todoListItem.insert<number>(1000, { listId: list.id, text: "A" });
    const [preset] = await db.todoPreset.insert(1, { listId: list.id, items: ["A"] });

    const presetService = makePresetService(db);
    expect(presetService.apply(preset.id, list.id, user.id)).resolves.not.toThrow();
});

test("appends items to the end of the list without creating duplicate items", async ({ db, user }) => {
    const [list] = await db.todoList.insert(1, { userId: user.id });
    await db.todoListItem.insert<number>(1, { listId: list.id, text: "0", index: 0 });
    await db.todoListItem.insert<number>(1, { listId: list.id, text: "A", index: 1 });
    await db.todoListItem.insert<number>(1, { listId: list.id, text: "B", index: null });
    const [preset] = await db.todoPreset.insert(1, { listId: list.id, items: ["B", "C"] });

    const presetService = makePresetService(db);
    await presetService.apply(preset.id, list.id, user.id);

    const items = await db.todoListItem.select();
    expect(items).toHaveLength(4);
    expect(items).toStrictEqual(
        expect.arrayContaining([
            expect.objectContaining({ text: "0", index: 0 }),
            expect.objectContaining({ text: "A", index: 1 }),
            expect.objectContaining({ text: "B", index: 2 }),
            expect.objectContaining({ text: "C", index: 3 }),
        ]),
    );
});
