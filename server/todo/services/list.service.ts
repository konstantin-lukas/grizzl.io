import ListRepository from "#server/todo/repositories/list.repository";

export default class ListService {
    static readonly deps = [ListRepository];

    constructor(private readonly listRepository: ListRepository) {}

    async getCollection(userId: string) {
        return this.listRepository.findByUserId(userId);
    }
}
