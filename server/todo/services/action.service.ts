import NotFoundError from "#server/core/errors/not-found.error";
import type { DatabaseTransaction } from "#server/core/repositories/base.repository";
import ListItemRepository from "#server/todo/repositories/list-item.repository";
import ListRepository from "#server/todo/repositories/list.repository";
import type { CreateAction, PostActionQueue } from "#shared/todo/validators/action.validator";

export default class ListService {
    static readonly deps = [ListRepository, ListItemRepository];

    constructor(
        private readonly listRepository: ListRepository,
        private readonly listItemRepository: ListItemRepository,
    ) {}

    async create(action: CreateAction, tx: DatabaseTransaction) {
        if (action.index !== null) {
            await this.listItemRepository.incrementIndices(action.listId, action.index, tx);
        }
        await this.listItemRepository.create(action, tx);
    }

    async processActions(userId: string, actions: PostActionQueue) {
        return this.listRepository.transaction(async tx => {
            await this.listRepository.advisoryLock(`execute-to-do-list-actions-${userId}`, tx);
            const lists = await this.listRepository.findByUserId(userId, tx);
            const listIds = new Set(lists.map(list => list.id));
            for (const action of actions) {
                if (!listIds.has(action.listId)) {
                    const message = `Cannot ${action.action} task with id ${action.id} on list with id ${action.listId} for user with id ${userId}. List does not exist for given user.`;
                    const logMessage = `Cannot ${action.action} task on given to-do list.`;
                    throw new NotFoundError(message, logMessage);
                }
                switch (action.action) {
                    case "create":
                        await this.create(action, tx);
                        break;
                }
            }
        });
    }
}
