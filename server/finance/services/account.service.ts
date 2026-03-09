import AccountRepository from "~~/server/finance/repositories/account.repository";

export default class AccountService {
    static readonly deps = [AccountRepository];

    constructor(private readonly accountRepository: AccountRepository) {}

    /* c8 ignore start */
    public async getList(userId: string) {
        return this.accountRepository.findByUserId(userId);
    }
    /* c8 ignore stop */
}
