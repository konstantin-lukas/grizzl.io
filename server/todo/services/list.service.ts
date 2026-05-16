import EntityLimitError from "#server/core/errors/entity-limit.error";
import NotFoundError from "#server/core/errors/not-found.error";
import UnknownError from "#server/core/errors/unknown.error";
import ListRepository from "#server/todo/repositories/list.repository";
import { type PostList, type PutList, TODO_MAX_LISTS } from "#shared/todo/validators/list.validator";

export default class ListService {
    static readonly deps = [ListRepository];

    constructor(private readonly listRepository: ListRepository) {}

    /* c8 ignore start */
    public async setDeletedStatus(id: string, userId: string, isDeleted: boolean) {
        const operation = isDeleted ? "delete" : "undelete";
        const rowCount = await this.listRepository[operation]({ id, userId });
        if (rowCount === 0) {
            const logMessage = `Unable to ${operation} todo list with id ${id} and user id ${userId}.`;
            throw new NotFoundError("The requested todo list does not exist.", logMessage);
        }
    }

    public async update(id: string, userId: string, account: PutList) {
        const rowCount = await this.listRepository.update(id, userId, account);
        if (rowCount === 0) {
            const logMessage = `Unable to update todo list with id ${id} and user id ${userId}. Given data: ${JSON.stringify(account)}.`;
            throw new NotFoundError("The requested todo list does not exist.", logMessage);
        }
    }

    async getCollection(userId: string) {
        const lists = await this.listRepository.findByUserId(userId);
        return lists.map(({ items, ...rest }) => {
            const mapItem = ({ index, ...item }: (typeof items)[number]) => item;

            const groupedItems = {
                uncompleted: [],
                completed: [],
                ...Object.groupBy(items, item => (typeof item.index === "number" ? "uncompleted" : "completed")),
            };

            return {
                ...rest,
                items: {
                    completed: groupedItems.completed.map(mapItem),
                    uncompleted: groupedItems.uncompleted.map(mapItem),
                },
            };
        });
    }

    async create(userId: string, list: PostList) {
        return this.listRepository.transaction(async tx => {
            await this.listRepository.advisoryLock(`createToDoList${userId}`, tx);
            const count = await this.listRepository.getCount(userId, tx);

            if (typeof count !== "number") {
                const logMessage = `Unable to retrieve todo list count for user with id ${userId}. Received: "${count}".`;
                throw new UnknownError("Unable to check entity limit.", logMessage);
            }
            if (count >= TODO_MAX_LISTS) {
                const logMessage = `User with id ${userId} tried to create more todo lists than allowed. Received: ${count}; Max: ${TODO_MAX_LISTS}`;
                throw new EntityLimitError(`The maximum amount of to-do lists is ${TODO_MAX_LISTS}.`, logMessage);
            }

            return this.listRepository.create(userId, list, tx);
        });
    }
    /* c8 ignore stop */
}
