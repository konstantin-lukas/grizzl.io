import type { DatabaseTransaction } from "#server/core/repositories/base.repository";
import AccountService from "#server/finance/services/account.service";
import AutoTransactionService from "#server/finance/services/auto-transaction.service";
import CategoryService from "#server/finance/services/category.service";
import { tryCatch } from "#shared/core/utils/result.util";
import type {
    BaseTransactionFilters,
    GetTransactionFilters,
    PostTransaction,
    PutTransaction,
} from "#shared/finance/validators/transaction.validator";
import InvalidAccountBalanceError from "~~/server/core/errors/invalid-account-balance.error";
import NotFoundError from "~~/server/core/errors/not-found.error";
import UnknownError from "~~/server/core/errors/unknown.error";
import LoggerService from "~~/server/core/services/logger.service";
import AccountRepository from "~~/server/finance/repositories/account.repository";
import TransactionRepository from "~~/server/finance/repositories/transaction.repository";

export default class TransactionService {
    static readonly deps = [
        TransactionRepository,
        AccountRepository,
        CategoryService,
        AccountService,
        AutoTransactionService,
        LoggerService,
    ];

    constructor(
        private readonly transactionRepository: TransactionRepository,
        private readonly accountRepository: AccountRepository,
        private readonly categoryService: CategoryService,
        private readonly accountService: AccountService,
        private readonly autoTransactionService: AutoTransactionService,
        private readonly logger: LoggerService,
    ) {}

    private async updateDeletedStatus(
        id: string,
        userId: string,
        operation: "delete" | "undelete",
        tx: DatabaseTransaction,
    ) {
        const rowCount = await this.transactionRepository[operation]({ id, userId }, tx);
        if (!rowCount) {
            const logMessage = `Unable to ${operation} transaction with id ${id} and user id ${userId}.`;
            throw new NotFoundError("The requested transaction does not exist.", logMessage);
        }
    }

    public async setDeletedStatus(id: string, userId: string, accountId: string, isDeleted: boolean) {
        return this.transactionRepository.transaction(async tx => {
            const operation = isDeleted ? "delete" : "undelete";

            const exists = await this.accountRepository.hasSubResource(id, userId, accountId, "financeTransaction", tx);
            if (!exists) {
                const logMessage = `Transaction with id ${id} does not exist on account with id ${accountId} of user ${userId}.`;
                throw new NotFoundError("The requested account does not exist.", logMessage);
            }

            if (operation === "undelete") await this.updateDeletedStatus(id, userId, "undelete", tx);

            const [account, amount] = await Promise.all([
                this.accountService.getUserAccount(userId, accountId, tx),
                this.transactionRepository.getAmountByIdAndUserAndAccount(id, userId, accountId, tx),
            ]);

            if (typeof amount !== "number") {
                const logMessage = `Unable to retrieve amount from transaction with ${id} on account with id ${accountId} for user with id ${userId}.`;
                throw new NotFoundError("The requested transaction does not exist.", logMessage);
            }

            const newBalance = account.balance + (operation === "delete" ? -amount : amount);

            if (!Number.isSafeInteger(newBalance)) {
                const logMessage = `Unable to ${operation} transaction with amount ${amount} on account with id ${accountId} and balance ${account.balance} for user with id ${userId} because resulting balance is invalid.`;
                throw new InvalidAccountBalanceError("The resulting account balance is invalid.", logMessage);
            }

            const affectedRows = await this.accountRepository.updateBalance(account.id, newBalance, tx);
            if (!affectedRows) {
                const logMessage = `The account with the id ${account.id} was not updated (during ${operation}) with new balance ${newBalance} for user with id ${userId}.`;
                throw new UnknownError("Unable to update account balance.", logMessage);
            }

            if (operation === "delete") await this.updateDeletedStatus(id, userId, "delete", tx);
        });
    }

    /* c8 ignore start */
    public async getBalance(userId: string, accountId: string, filters: BaseTransactionFilters) {
        await this.accountService.getUserAccount(userId, accountId);
        return await this.transactionRepository.getAccountBalanceUntil(userId, accountId, filters);
    }

    public async getList(userId: string, accountId: string, tz: string, filters?: GetTransactionFilters) {
        const { error } = await tryCatch(this.autoTransactionService.execute(userId, accountId, tz));
        if (error) this.logger.error(error.message);
        return this.transactionRepository.findByUserAndAccountId(userId, accountId, filters);
    }
    /* c8 ignore stop */

    public async create(userId: string, accountId: string, transaction: PostTransaction) {
        return this.transactionRepository.transaction(async tx => {
            const account = await this.accountService.getUserAccount(userId, accountId, tx);

            const newBalance = account.balance + transaction.amount;
            if (!Number.isSafeInteger(newBalance)) {
                const logMessage = `Unable to create transaction with amount ${transaction.amount} on account with id ${accountId} and balance ${account.balance} for user with id ${userId}.`;
                throw new InvalidAccountBalanceError("The resulting account balance is invalid.", logMessage);
            }

            const affectedRows = await this.accountRepository.updateBalance(account.id, newBalance, tx);
            if (!affectedRows) {
                const logMessage = `The account with the id ${account.id} was not updated with new balance ${newBalance} for user with id ${userId}.`;
                throw new UnknownError("Unable to update account balance.", logMessage);
            }

            const { category: newCategory, ...newTransaction } = transaction;
            const categoryId = await this.categoryService.upsert(userId, accountId, newCategory, tx);

            return await this.transactionRepository.create(accountId, { ...newTransaction, categoryId }, tx);
        });
    }

    public async update(id: string, userId: string, accountId: string, transaction: PutTransaction) {
        return this.transactionRepository.transaction(async tx => {
            const account = await this.accountService.getUserAccount(userId, accountId, tx);

            const previousAmount = await this.transactionRepository.getAmountByIdAndUserAndAccount(
                id,
                userId,
                accountId,
                tx,
            );

            if (typeof previousAmount !== "number") {
                const logMessage = `Unable to update transaction with ${id} on account with id ${accountId} for user with id ${userId}. Given transaction: ${JSON.stringify(transaction)}.`;
                throw new NotFoundError("The requested transaction does not exist.", logMessage);
            }

            const delta = transaction.amount - previousAmount;
            const newBalance = account.balance + delta;
            if (!Number.isSafeInteger(newBalance)) {
                const logMessage = `Unable to update transaction with amount ${transaction.amount} on account with id ${accountId} and balance ${account.balance} for user with id ${userId}.`;
                throw new InvalidAccountBalanceError("The resulting account balance is invalid.", logMessage);
            }

            const affectedRows = await this.accountRepository.updateBalance(account.id, newBalance, tx);
            if (!affectedRows) {
                const logMessage = `The account with the id ${account.id} was not updated with new balance ${newBalance} for user with id ${userId}.`;
                throw new UnknownError("Unable to update account balance.", logMessage);
            }

            const { category: newCategory, ...newTransaction } = transaction;
            const categoryId = await this.categoryService.upsert(userId, accountId, newCategory, tx);

            const rowCount = await this.transactionRepository.update(id, userId, { ...newTransaction, categoryId }, tx);

            if (!rowCount) {
                const logMessage = `Unable to update transaction with id ${id} and user id ${userId}. Given data: ${JSON.stringify(transaction)}.`;
                throw new UnknownError("Unable to update transaction.", logMessage);
            }
        });
    }
}
