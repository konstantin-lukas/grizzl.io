import ListRepository from "#server/todo/repositories/list.repository";
import type { PostList } from "#shared/todo/validators/list.validator";

export default class ListService {
    static readonly deps = [ListRepository];

    constructor(private readonly listRepository: ListRepository) {}

    /* c8 ignore start */
    async getCollection(userId: string) {
        return this.listRepository.findByUserId(userId);
    }

    async create(userId: string, list: PostList) {
        return this.listRepository.create(userId, list);
    }
    /* c8 ignore stop */
}
