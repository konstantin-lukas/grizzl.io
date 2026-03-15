import type { GetTransactionFilters, PostTransaction } from "#shared/finance/validators/transaction.validator";
import TransactionRepository from "~~/server/finance/repositories/transaction.repository";

export default class TransactionService {
    static readonly deps = [TransactionRepository];

    constructor(private readonly transactionRepository: TransactionRepository) {}

    /* c8 ignore start */
    public async getList(userId: string, accountId: string, filters?: GetTransactionFilters) {
        return this.transactionRepository.findByUserAndAccountId(userId, accountId, filters);
    }

    public async create(userId: string, accountId: string, transaction: PostTransaction) {
        return this.transactionRepository.transaction(tx => {
            return this.transactionRepository.create(accountId, transaction, tx);
        });
    }
    /* c8 ignore stop */
}
