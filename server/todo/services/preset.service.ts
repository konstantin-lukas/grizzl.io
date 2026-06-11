import NotFoundError from "#server/core/errors/not-found.error";
import ListRepository from "#server/todo/repositories/list.repository";
import PresetRepository from "#server/todo/repositories/preset.repository";
import type { PostPreset } from "#shared/todo/validators/preset.validator";

export default class PresetService {
    static readonly deps = [PresetRepository, ListRepository];

    constructor(
        private readonly presetRepository: PresetRepository,
        private readonly listRepository: ListRepository,
    ) {}

    /* c8 ignore start */
    public async getList(userId: string, listId: string) {
        return this.presetRepository.findByUserAndListId(userId, listId);
    }
    /* c8 ignore stop */

    public async create(userId: string, listId: string, preset: PostPreset) {
        const lists = await this.listRepository.findByUserId(userId);
        const listExists = lists.some(list => list.id === listId);
        if (!listExists) {
            const logMessage = `Unable to create todo list preset for user with id ${userId} on list with id ${listId}.`;
            throw new NotFoundError("The requested todo list does not exist.", logMessage);
        }
        return this.presetRepository.create(listId, preset);
    }
}
