import CategoryRepository from "~~/server/finance/repositories/category.repository";

export default class CategoryService {
    static readonly deps = [CategoryRepository];

    constructor(
        private readonly categoryRepository: CategoryRepository,
    ) {}

    /* c8 ignore start */
    public async getList(userId: string, accountId: string) {
        return this.categoryRepository.findByUserAndAccountId(userId, accountId);
    }
    /* c8 ignore stop */
}
