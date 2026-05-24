import ListItemRepository from "#server/todo/repositories/list-item.repository";
import type { PostActionQueue } from "#shared/todo/validators/action.validator";

export default class ListService {
    static readonly deps = [ListItemRepository];

    constructor(private readonly listItemRepository: ListItemRepository) {}

    async processActions(userId: string, actions: PostActionQueue) {}
}
