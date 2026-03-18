import type {
    GetTransactionFilters,
    PostTransaction,
    PutTransaction,
} from "#shared/finance/validators/transaction.validator";
import InvalidAccountBalanceError from "~~/server/core/errors/invalid-account-balance.error";
import NotFoundError from "~~/server/core/errors/not-found.error";
import UnknownError from "~~/server/core/errors/unknown.error";
import AccountRepository from "~~/server/finance/repositories/account.repository";
import TransactionRepository from "~~/server/finance/repositories/transaction.repository";

export default class TransactionService {
    static readonly deps = [TransactionRepository, AccountRepository];

    constructor(
        private readonly transactionRepository: TransactionRepository,
        private readonly accountRepository: AccountRepository,
    ) {}

    public async setDeletedStatus(id: string, userId: string, isDeleted: boolean) {
        const operation = isDeleted ? "delete" : "undelete";
        const rowCount = await this.transactionRepository[operation]({ id, userId });
        if (rowCount === 0) {
            const logMessage = `Unable to ${operation} account with id ${id} and user id ${userId}.`;
            throw new NotFoundError("The requested account does not exist.", logMessage);
        }
    }

    /* c8 ignore start */
    public async getList(userId: string, accountId: string, filters?: GetTransactionFilters) {
        return this.transactionRepository.findByUserAndAccountId(userId, accountId, filters);
    }
    /* c8 ignore stop */

    public async create(userId: string, accountId: string, transaction: PostTransaction) {
        return this.transactionRepository.transaction(async tx => {
            const accounts = await this.accountRepository.findByUserId(userId, tx);
            const account = accounts.find(account => account.id === accountId);
            if (!account) {
                const logMessage = `Unable to create transaction on account with id ${accountId} for user with id ${userId}.`;
                throw new NotFoundError("The requested account does not exist.", logMessage);
            }

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

            return await this.transactionRepository.create(accountId, transaction, tx);
        });
    }

    public async update(id: string, userId: string, accountId: string, transaction: PutTransaction) {
        return this.transactionRepository.transaction(async tx => {
            const accounts = await this.accountRepository.findByUserId(userId, tx);
            const account = accounts.find(account => account.id === accountId);

            if (!account) {
                const logMessage = `Unable to update transaction on account with id ${accountId} for user with id ${userId}.`;
                throw new NotFoundError("The requested account does not exist.", logMessage);
            }

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

            const rowCount = await this.transactionRepository.update(id, userId, transaction, tx);

            if (!rowCount) {
                const logMessage = `Unable to update transaction with id ${id} and user id ${userId}. Given data: ${JSON.stringify(transaction)}.`;
                throw new UnknownError("Unable to update transaction.", logMessage);
            }
        });
    }
}
