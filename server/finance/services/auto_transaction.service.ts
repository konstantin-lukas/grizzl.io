import type { PostAutoTransaction } from "#shared/finance/validators/auto_transaction.validator";
import NotFoundError from "~~/server/core/errors/not-found.error";
import AccountRepository from "~~/server/finance/repositories/account.repository";
import AutoTransactionRepository from "~~/server/finance/repositories/auto_transaction.repository";

export default class TransactionService {
    static readonly deps = [AutoTransactionRepository, AccountRepository];

    constructor(
        private readonly autoTransactionRepository: AutoTransactionRepository,
        private readonly accountRepository: AccountRepository,
    ) {}

    /* c8 ignore start */
    public async getList(userId: string, accountId: string) {
        return this.autoTransactionRepository.findByUserAndAccountId(userId, accountId);
    }
    /* c8 ignore stop */

    public async create(userId: string, accountId: string, autoTransaction: PostAutoTransaction) {
        const accounts = await this.accountRepository.findByUserId(userId);
        const account = accounts.find(account => account.id === accountId);
        if (!account) {
            const logMessage = `Unable to create transaction on account with id ${accountId} for user with id ${userId}.`;
            throw new NotFoundError("The requested account does not exist.", logMessage);
        }

        return await this.autoTransactionRepository.create(accountId, autoTransaction);
    }
}
