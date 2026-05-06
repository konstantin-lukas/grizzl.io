import type { ExecutionContext } from "#server/core/repositories/base.repository";
import type { PostAccount, PutAccount } from "#shared/finance/validators/account.validator";
import NotFoundError from "~~/server/core/errors/not-found.error";
import AccountRepository from "~~/server/finance/repositories/account.repository";

export default class AccountService {
    static readonly deps = [AccountRepository];

    constructor(private readonly accountRepository: AccountRepository) {}

    public async getUserAccount(userId: string, accountId: string, tx?: ExecutionContext) {
        const accounts = await this.accountRepository.findByUserId(userId, tx, true);
        const account = accounts.find(account => account.id === accountId);

        if (!account) {
            const logMessage = `Unable to find account with id ${accountId} for user with id ${userId}.`;
            throw new NotFoundError("The requested account does not exist.", logMessage);
        }

        return account;
    }

    public async setDeletedStatus(id: string, userId: string, isDeleted: boolean) {
        const operation = isDeleted ? "delete" : "undelete";
        const rowCount = await this.accountRepository[operation]({ id, userId });
        if (rowCount === 0) {
            const logMessage = `Unable to ${operation} account with id ${id} and user id ${userId}.`;
            throw new NotFoundError("The requested account does not exist.", logMessage);
        }
    }

    public async update(id: string, userId: string, account: PutAccount) {
        const rowCount = await this.accountRepository.update(id, userId, account);
        if (rowCount === 0) {
            const logMessage = `Unable to update account with id ${id} and user id ${userId}. Given data: ${JSON.stringify(account)}.`;
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
