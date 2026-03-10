import type { PostAccount } from "#shared/finance/validators/account.validator";
import NotFoundError from "~~/server/core/errors/not-found.error";
import AccountRepository from "~~/server/finance/repositories/account.repository";

export default class AccountService {
    static readonly deps = [AccountRepository];

    constructor(private readonly accountRepository: AccountRepository) {}

    public async setDeletedStatus(id: string, userId: string, isDeleted: boolean) {
        const operation = isDeleted ? "delete" : "undelete";
        const rowCount = await this.accountRepository[operation]({ id, userId });
        if (rowCount === 0) {
            const logMessage = `Unable to ${operation} account with id ${id} and user id ${userId}.`;
            throw new NotFoundError("The requested account does not exist.", logMessage);
        }
    }

    /* c8 ignore start */
    public async getList(userId: string) {
        return this.accountRepository.findByUserId(userId);
    }

    public async create(userId: string, account: PostAccount) {
        return this.accountRepository.create(userId, account);
    }
    /* c8 ignore stop */
}
