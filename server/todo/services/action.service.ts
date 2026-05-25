import EntityLimitError from "#server/core/errors/entity-limit.error";
import NotFoundError from "#server/core/errors/not-found.error";
import OutOfBoundsError from "#server/core/errors/out-of-bounds.error";
import UniqueConstraintError from "#server/core/errors/unique-constraint.error";
import type { DatabaseTransaction } from "#server/core/repositories/base.repository";
import ListItemRepository from "#server/todo/repositories/list-item.repository";
import ListRepository from "#server/todo/repositories/list.repository";
import { tryCatch } from "#shared/core/utils/result.util";
import type { CreateAction, PostActionQueue } from "#shared/todo/validators/action.validator";
import { TODO_LIST_MAX_LENGTH } from "#shared/todo/validators/list.validator";

interface MinimalList {
    id: string;
    items: { text: string; index: number | null; id: string }[];
}

export default class ActionService {
    static readonly deps = [ListRepository, ListItemRepository];

    constructor(
        private readonly listRepository: ListRepository,
        private readonly listItemRepository: ListItemRepository,
    ) {}

    private async create(action: CreateAction, list: MinimalList, tx: DatabaseTransaction) {
        if (list.items.length >= TODO_LIST_MAX_LENGTH) {
            const message = "Cannot create new task. The given list is full.";
            const logMessage = `Cannot create new task on list with id ${list.id}. List is full.`;
            throw new EntityLimitError(message, logMessage);
        }

        const largestIndex = list.items.reduce(
            (max: { index: number | null }, item: { index: number | null }) => {
                if (item.index === null) return max;
                if (max.index === null) return item;
                return item.index > max.index ? item : max;
            },
            { index: null },
        ).index;

        if (
            (largestIndex === null && action.index !== null && action.index !== 0) ||
            (largestIndex !== null && action.index !== null && action.index > largestIndex + 1)
        ) {
            const message = `Cannot create new task at position ${action.index}. Out of bounds.`;
            const logMessage = `Cannot create new task on list with id ${list.id} at position ${action.index}. Out of bounds.`;
            throw new OutOfBoundsError(message, logMessage);
        }

        if (action.index !== null) {
            await this.listItemRepository.incrementIndices(action.listId, action.index, tx);
        }

        const { error } = await tryCatch(this.listItemRepository.create(action, tx));
        if (!error) {
            list.items.push({ ...action });
            return;
        }

        throw new UniqueConstraintError(
            `Unable to create item with id ${action.id} on list with id ${action.listId}`,
            error.message,
        );
    }

    async processActions(userId: string, actions: PostActionQueue) {
        return this.listRepository.transaction(async tx => {
            await this.listRepository.advisoryLock(`execute-to-do-list-actions-${userId}`, tx);
            const lists = await this.listRepository.findByUserId(userId, tx);
            for (const action of actions) {
                const list: MinimalList | undefined = lists.find(list => list.id === action.listId);
                if (!list) {
                    const message = `Cannot ${action.action} task with id ${action.id} on list with id ${action.listId} for user with id ${userId}. List does not exist for given user.`;
                    const logMessage = `Cannot ${action.action} task on given to-do list.`;
                    throw new NotFoundError(message, logMessage);
                }
                if (action.action === "create") {
                    await this.create(action, list, tx);
                    continue;
                }
            }
        });
    }
}
