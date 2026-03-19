import AutoTransactionRepository from "~~/server/finance/repositories/auto_transaction.repository";

export default class TransactionService {
    static readonly deps = [AutoTransactionRepository];

    constructor(private readonly autoTransactionRepository: AutoTransactionRepository) {}

    /* c8 ignore start */
    public async getList(userId: string, accountId: string) {
        return this.autoTransactionRepository.findByUserAndAccountId(userId, accountId);
    }
    /* c8 ignore stop */
}
