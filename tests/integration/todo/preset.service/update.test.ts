import NotFoundError from "#server/core/errors/not-found.error";
import ListItemRepository from "#server/todo/repositories/list-item.repository";
import ListRepository from "#server/todo/repositories/list.repository";
import PresetRepository from "#server/todo/repositories/preset.repository";
import PresetService from "#server/todo/services/preset.service";
import type { DBFixtures } from "~~/test-utils/database/fixture";
import { expect, test } from "~~/test-utils/vitest";

function makePresetService(db: DBFixtures) {
    const presetRepository = new PresetRepository(db.client);
    const listRepository = new ListRepository(db.client);
    const listItemRepository = new ListItemRepository(db.client);
    return new PresetService(presetRepository, listRepository, listItemRepository);
}

test("updates a preset and returns the amount of affected rows", async ({ db, user }) => {
    const [list] = await db.todoList.insert(1, { userId: user.id });
    const [preset] = await db.todoPreset.insert(1, { listId: list.id });

    const presetService = makePresetService(db);

    const items = ["Bananas", "Oranges"];
    const title = "Fruit";
    const rowCount = await presetService.update(preset.id, list.id, user.id, { items, title });

    const [updatedPreset] = await db.todoPreset.select();

    expect(rowCount).toBe(1);
    expect(updatedPreset).toStrictEqual({ ...preset, items, title });
});

test("throws a NotFoundError error when the list id is wrong", async ({ db, user }) => {
    const presetService = makePresetService(db);

    const [list] = await db.todoList.insert(1, { userId: user.id });
    const [preset] = await db.todoPreset.insert(1, { listId: list.id });
    await expect(presetService.update(preset.id, "Bananas", user.id, { items: [], title: "Bananas" })).rejects.toThrow(
        NotFoundError,
    );
});

test("throws a NotFoundError error when the user id is wrong", async ({ db, user }) => {
    const presetService = makePresetService(db);

    const [list] = await db.todoList.insert(1, { userId: user.id });
    const [preset] = await db.todoPreset.insert(1, { listId: list.id });
    await expect(presetService.update(preset.id, list.id, "Bananas", { items: [], title: "Bananas" })).rejects.toThrow(
        NotFoundError,
    );
});
