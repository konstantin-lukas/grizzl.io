import AccountService from "#server/finance/services/account.service";
import CategoryService from "#server/finance/services/category.service";
import type { PostAutoTransaction, PutAutoTransaction } from "#shared/finance/validators/auto_transaction.validator";
import NotFoundError from "~~/server/core/errors/not-found.error";
import AccountRepository from "~~/server/finance/repositories/account.repository";
import AutoTransactionRepository from "~~/server/finance/repositories/auto_transaction.repository";

export default class AutoTransactionService {
    static readonly deps = [AutoTransactionRepository, AccountRepository, CategoryService, AccountService];

    constructor(
        private readonly autoTransactionRepository: AutoTransactionRepository,
        private readonly accountRepository: AccountRepository,
        private readonly categoryService: CategoryService,
        private readonly accountService: AccountService,
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
        return this.autoTransactionRepository.transaction(async tx => {
            await this.accountService.getUserAccount(userId, accountId, tx);

            const { category, ...newAutoTransaction } = autoTransaction;
            const categoryId = await this.categoryService.upsert(userId, accountId, category, tx);
            const result = await this.autoTransactionRepository.update(
                id,
                userId,
                accountId,
                { ...newAutoTransaction, categoryId },
                tx,
            );

            if (!result) {
                const logMessage = `Unable to update auto-transaction ${id} on account with id ${accountId} for user with id ${userId}.`;
                throw new NotFoundError(
                    "The requested auto-transaction does not exist on the given account.",
                    logMessage,
                );
            }

            return result;
        });
    }

    public async create(userId: string, accountId: string, autoTransaction: PostAutoTransaction) {
        return this.autoTransactionRepository.transaction(async tx => {
            await this.accountService.getUserAccount(userId, accountId, tx);
            const { category, ...newAutoTransaction } = autoTransaction;
            const categoryId = await this.categoryService.upsert(userId, accountId, category, tx);
            return await this.autoTransactionRepository.create(accountId, { ...newAutoTransaction, categoryId }, tx);
        });
    }
}
