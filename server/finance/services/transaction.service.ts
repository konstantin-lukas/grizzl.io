import TransactionRepository from "~~/server/finance/repositories/transaction.repository";

export default class TransactionService {
    static readonly deps = [TransactionRepository];

    constructor(private readonly transactionRepository: TransactionRepository) {}

    /* c8 ignore start */
    public async getList(userId: string, accountId: string) {
        return this.transactionRepository.findByAccountAndUserId(userId, accountId);
    }
    /* c8 ignore stop */
}
