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

test("throws a NotFoundError if the preset doesn't belong to the list", async ({ db, user }) => {
    const [list] = await db.todoList.insert(1, { userId: user.id });
    const [preset] = await db.todoPreset.insert(1, { listId: list.id });

    const presetService = makePresetService(db);
    expect(presetService.apply(preset.id, list.id, user.id)).rejects.toThrow(NotFoundError);
});
