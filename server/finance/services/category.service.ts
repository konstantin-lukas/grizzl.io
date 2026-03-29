import UnknownError from "#server/core/errors/unknown.error";
import type { DatabaseTransaction } from "#server/core/repositories/base.repository";
import type { CategoryInternal } from "#shared/finance/validators/category.validator";
import CategoryRepository from "~~/server/finance/repositories/category.repository";

export default class CategoryService {
    static readonly deps = [CategoryRepository];

    constructor(private readonly categoryRepository: CategoryRepository) {}

    public async upsert(userId: string, accountId: string, category: CategoryInternal, tx?: DatabaseTransaction) {
        const categories = await this.categoryRepository.upsert(accountId, category, tx);

        if (categories.length !== 1) {
            const logMessage = `Unable to upsert category on account with id ${accountId} for user with id ${userId}. Given values: ${JSON.stringify(category)}`;
            throw new UnknownError("Unable to save category.", logMessage);
        }

        return categories[0]!.id;
    }

    /* c8 ignore start */
    public async getList(userId: string, accountId: string) {
        return this.categoryRepository.findByUserAndAccountId(userId, accountId);
    }
    /* c8 ignore stop */
}
