import DuplicateKeyError from "#server/core/errors/duplicate-key.error";
import EntityLimitError from "#server/core/errors/entity-limit.error";
import NotFoundError from "#server/core/errors/not-found.error";
import OutOfBoundsError from "#server/core/errors/out-of-bounds.error";
import UniqueConstraintError from "#server/core/errors/unique-constraint.error";
import type { DatabaseTransaction } from "#server/core/repositories/base.repository";
import ListItemRepository from "#server/todo/repositories/list-item.repository";
import ListRepository from "#server/todo/repositories/list.repository";
import { tryCatch } from "#shared/core/utils/result.util";
import type {
    ChangeAction,
    CheckAction,
    CreateAction,
    DeleteAction,
    MoveAction,
    PostActionQueue,
    ScheduleAction,
} from "#shared/todo/validators/action.validator";
import { TODO_LIST_MAX_LENGTH } from "#shared/todo/validators/list.validator";

interface MinimalList {
    id: string;
    items: { text: string; index: number | null; id: string }[];
}

type ListItem = MinimalList["items"][number];

export default class ActionService {
    static readonly deps = [ListRepository, ListItemRepository];

    constructor(
        private readonly listRepository: ListRepository,
        private readonly listItemRepository: ListItemRepository,
    ) {}

    public static findLargestIndex(list: MinimalList) {
        return list.items.reduce(
            (max, item) => {
                if (item.index === null) return max;
                if (max.index === null) return item;
                return item.index > max.index ? item : max;
            },
            { index: null as number | null },
        ).index;
    }

    private async create(action: CreateAction, list: MinimalList, tx: DatabaseTransaction) {
        if (list.items.length >= TODO_LIST_MAX_LENGTH) {
            const message = "Cannot create new task. The given list is full.";
            const logMessage = `Cannot create new task on list with id ${list.id}. List is full.`;
            throw new EntityLimitError(message, logMessage);
        }

        const largestIndex = ActionService.findLargestIndex(list);

        if (
            (largestIndex === null && action.index !== null && action.index !== 0) ||
            (largestIndex !== null && action.index !== null && action.index > largestIndex + 1)
        ) {
            const message = `Cannot create new task at position ${action.index}. Out of bounds.`;
            const logMessage = `Cannot create new task on list with id ${list.id} at position ${action.index}. Out of bounds.`;
            throw new OutOfBoundsError(message, logMessage);
        }

        if (action.index !== null) {
            await this.listItemRepository.incrementIndices(action.listId, { min: action.index }, tx);
            this.incrementLocalListIndices(list, action.index);
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

    private async change(action: ChangeAction, tx: DatabaseTransaction) {
        await this.listItemRepository.updateText(action, tx);
    }

    private async schedule(action: ScheduleAction, tx: DatabaseTransaction) {
        await this.listItemRepository.updateScheduledFor(action, tx);
    }

    private decrementLocalListIndices(list: MinimalList, min: number, max = TODO_LIST_MAX_LENGTH) {
        for (const item of list.items) {
            if (item.index !== null && item.index >= min && item.index <= max) item.index--;
        }
    }

    private incrementLocalListIndices(list: MinimalList, min: number, max = TODO_LIST_MAX_LENGTH) {
        for (const item of list.items) {
            if (item.index !== null && item.index >= min && item.index <= max) item.index++;
        }
    }

    private async check(action: CheckAction, targetItem: ListItem, list: MinimalList, tx: DatabaseTransaction) {
        const oldIndex = targetItem.index;
        if (oldIndex === null) {
            const newIndex = list.items.filter(item => item.index !== null).length;
            targetItem.index = newIndex;
            await this.listItemRepository.updateIndex({ listId: list.id, id: action.id, value: newIndex }, tx);
            return;
        }
        targetItem.index = null;
        this.decrementLocalListIndices(list, oldIndex + 1);
        await this.listItemRepository.updateIndex({ listId: list.id, id: action.id, value: null }, tx);
        await this.listItemRepository.decrementIndices(list.id, { min: oldIndex + 1 }, tx);
    }

    private async delete(action: DeleteAction, targetItem: ListItem, list: MinimalList, tx: DatabaseTransaction) {
        await this.listItemRepository.deleteByList(action, tx);
        if (targetItem.index !== null) {
            await this.listItemRepository.decrementIndices(list.id, { min: targetItem.index + 1 }, tx);
            this.decrementLocalListIndices(list, targetItem.index + 1);
        }
        list.items = list.items.filter(item => item.id !== action.id);
    }

    private async move(action: MoveAction, targetItem: ListItem, list: MinimalList, tx: DatabaseTransaction) {
        const oldIndex = targetItem.index;
        const maxAllowedIndex = list.items.filter(item => item.index !== null).length;
        const targetIndex = action.to > maxAllowedIndex ? maxAllowedIndex : action.to;
        if (oldIndex === null || oldIndex === targetIndex) return;
        if (oldIndex < targetIndex) {
            this.decrementLocalListIndices(list, oldIndex + 1, targetIndex);
            targetItem.index = targetIndex;
            await this.listItemRepository.decrementIndices(list.id, { min: oldIndex + 1, max: targetIndex }, tx);
            await this.listItemRepository.updateIndex({ listId: list.id, id: targetItem.id, value: targetIndex }, tx);
            return;
        }
        this.incrementLocalListIndices(list, targetIndex, oldIndex - 1);
        targetItem.index = targetIndex;
        await this.listItemRepository.incrementIndices(list.id, { min: targetIndex, max: oldIndex - 1 }, tx);
        await this.listItemRepository.updateIndex({ listId: list.id, id: targetItem.id, value: targetIndex }, tx);
    }

    async processActions(userId: string, actions: PostActionQueue) {
        return this.listRepository.transaction(async tx => {
            await this.listRepository.advisoryLock(`execute-to-do-list-actions-${userId}`, tx);
            const lists = await this.listRepository.findByUserId(userId, tx);
            for (const action of actions) {
                const list: MinimalList | undefined = lists.find(list => list.id === action.listId);

                const message = `Cannot ${action.action} task with id ${action.id} on list with id ${action.listId} for user with id ${userId}. List does not exist for given user.`;
                const logMessage = `Cannot ${action.action} task on given to-do list.`;

                if (!list) throw new NotFoundError(message, logMessage);

                const targetItem = list.items.find(item => item.id === action.id);

                switch (action.action) {
                    case "create":
                        if (targetItem) throw new DuplicateKeyError(message, logMessage);
                        await this.create(action, list, tx);
                        break;
                    case "change":
                        if (!targetItem) throw new NotFoundError(message, logMessage);
                        await this.change(action, tx);
                        break;
                    case "schedule":
                        if (!targetItem) throw new NotFoundError(message, logMessage);
                        await this.schedule(action, tx);
                        break;
                    case "check":
                        if (!targetItem) throw new NotFoundError(message, logMessage);
                        await this.check(action, targetItem, list, tx);
                        break;
                    case "delete":
                        if (!targetItem) throw new NotFoundError(message, logMessage);
                        await this.delete(action, targetItem, list, tx);
                        break;
                    case "move":
                        if (!targetItem) throw new NotFoundError(message, logMessage);
                        await this.move(action, targetItem, list, tx);
                        break;
                }
            }
        });
    }
}
