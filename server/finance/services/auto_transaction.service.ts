import type { PostAutoTransaction, PutAutoTransaction } from "#shared/finance/validators/auto_transaction.validator";
import InvalidForeignKeyError from "~~/server/core/errors/invalid-foreign-key.error";
import NotFoundError from "~~/server/core/errors/not-found.error";
import AccountRepository from "~~/server/finance/repositories/account.repository";
import AutoTransactionRepository from "~~/server/finance/repositories/auto_transaction.repository";
import CategoryRepository from "~~/server/finance/repositories/category.repository";

export default class TransactionService {
    static readonly deps = [AutoTransactionRepository, AccountRepository, CategoryRepository];

    constructor(
        private readonly autoTransactionRepository: AutoTransactionRepository,
        private readonly accountRepository: AccountRepository,
        private readonly categoryRepository: CategoryRepository,
    ) {}

    public async setDeletedStatus(id: string, userId: string, accountId: string, isDeleted: boolean) {
        const operation = isDeleted ? "delete" : "undelete";

        const exists = await this.accountRepository.hasSubResource(id, userId, accountId, "financeAutoTransaction");
        if (!exists) {
            const logMessage = `Auto-transaction with id ${id} does not exist on account with id ${accountId} of user ${userId}.`;
            throw new NotFoundError("The requested account does not exist.", logMessage);
        }

        const rowCount = await this.autoTransactionRepository[operation]({ id, userId });
        if (rowCount === 0) {
            const logMessage = `Unable to ${operation} auto-transaction with id ${id} and user id ${userId}.`;
            throw new NotFoundError("The requested account does not exist.", logMessage);
        }
    }

    /* c8 ignore start */
    public async getList(userId: string, accountId: string) {
        return this.autoTransactionRepository.findByUserAndAccountId(userId, accountId);
    }
    /* c8 ignore stop */

    public async update(id: string, userId: string, accountId: string, autoTransaction: PutAutoTransaction) {
        const categories = await this.categoryRepository.findByUserAndAccountId(userId, accountId);
        const category = categories.find(category => category.id === autoTransaction.categoryId);

        if (!category) {
            const logMessage = `Unable to create auto transaction on account with id ${accountId} for user with id ${userId} using category id ${autoTransaction.categoryId}.`;
            throw new InvalidForeignKeyError("The provided category ID does not exist.", logMessage);
        }

        const result = await this.autoTransactionRepository.update(id, userId, accountId, autoTransaction);

        if (!result) {
            const logMessage = `Unable to update auto-transaction ${id} on account with id ${accountId} for user with id ${userId}.`;
            throw new NotFoundError("The requested auto-transaction does not exist on the given account.", logMessage);
        }

        return result;
    }

    public async create(userId: string, accountId: string, autoTransaction: PostAutoTransaction) {
        const [accounts, categories] = await Promise.all([
            this.accountRepository.findByUserId(userId),
            this.categoryRepository.findByUserAndAccountId(userId, accountId),
        ]);
        const account = accounts.find(account => account.id === accountId);
        const category = categories.find(category => category.id === autoTransaction.categoryId);

        if (!account) {
            const logMessage = `Unable to create auto transaction on account with id ${accountId} for user with id ${userId}.`;
            throw new NotFoundError("The requested account does not exist.", logMessage);
        }

        if (!category) {
            const logMessage = `Unable to create auto transaction on account with id ${accountId} for user with id ${userId} using category id ${autoTransaction.categoryId}.`;
            throw new InvalidForeignKeyError("The provided category ID does not exist.", logMessage);
        }

        return await this.autoTransactionRepository.create(accountId, autoTransaction);
    }
}
