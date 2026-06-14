import EntityLimitError from "#server/core/errors/entity-limit.error";
import NotFoundError from "#server/core/errors/not-found.error";
import ListRepository from "#server/todo/repositories/list.repository";
import PresetRepository from "#server/todo/repositories/preset.repository";
import { TODO_LIST_MAX_LENGTH } from "#shared/todo/validators/list.validator";
import type { PostPreset, PutPreset } from "#shared/todo/validators/preset.validator";

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

    public async setDeletedStatus(id: string, listId: string, userId: string, isDeleted: boolean) {
        const operation = isDeleted ? "delete" : "undelete";

        const listExists = await this.listRepository.hasPreset(id, userId, listId);
        if (!listExists) {
            const logMessage = `Unable to ${operation} todo preset with id ${id} and user id ${userId} on list with id ${listId}.`;
            throw new NotFoundError("The requested list does not exist.", logMessage);
        }

        const rowCount = await this.presetRepository[operation]({ id, userId });
        if (!rowCount) {
            const logMessage = `Unable to ${operation} todo preset with id ${id} and user id ${userId}.`;
            throw new NotFoundError("The requested todo preset does not exist.", logMessage);
        }
    }
    /* c8 ignore stop */

    private async doesListExist(userId: string, listId: string) {
        const lists = await this.listRepository.findByUserId(userId);
        return lists.some(list => list.id === listId);
    }

    public async create(userId: string, listId: string, preset: PostPreset) {
        const listExists = await this.doesListExist(userId, listId);
        if (!listExists) {
            const logMessage = `Unable to create todo list preset for user with id ${userId} on list with id ${listId}.`;
            throw new NotFoundError("The requested todo list does not exist.", logMessage);
        }
        return this.presetRepository.create(listId, preset);
    }

    public async update(id: string, listId: string, userId: string, preset: PutPreset) {
        const result = await this.presetRepository.update(id, listId, userId, preset);
        if (!result) {
            const logMessage = `Unable to update todo list preset for user with id ${userId} on list with id ${listId}.`;
            throw new NotFoundError("The requested resource does not exist.", logMessage);
        }
        return result;
    }

    public async apply(id: string, listId: string, userId: string) {
        return this.presetRepository.transaction(async tx => {
            await this.presetRepository.advisoryLock(`apply-transition-${listId}`, tx);

            const list = await this.listRepository.findByUserIdAndListId(userId, listId, tx);
            const preset = await this.presetRepository.findByIdUserIdAndListId(id, userId, listId, tx);

            if (!list || !preset) {
                const logMessage = `Unable to apply todo preset with id ${id} and user id ${userId} on list with id ${listId}.`;
                throw new NotFoundError("The requested resource does not exist.", logMessage);
            }

            const listItemCount = list.items.length;

            const listItems = new Set(list.items.map(({ text }) => text));
            const presetItems = new Set(preset.items);

            const itemsToInsert = presetItems.difference(listItems);

            const resultingListSize = listItemCount + itemsToInsert.size;

            if (resultingListSize > TODO_LIST_MAX_LENGTH) {
                const logMessage = `Unable to apply todo preset with id ${id} and user id ${userId} on list with id ${listId} because resulting list size is ${resultingListSize}.`;
                throw new EntityLimitError("Unable to apply preset. Too many items.", logMessage);
            }
        });
    }
}
