import NotFoundError from "#server/core/errors/not-found.error";
import ListRepository from "#server/todo/repositories/list.repository";
import type { PostList, PutList } from "#shared/todo/validators/list.validator";

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
        return this.listRepository.findByUserId(userId);
    }

    async create(userId: string, list: PostList) {
        return this.listRepository.create(userId, list);
    }
    /* c8 ignore stop */
}
