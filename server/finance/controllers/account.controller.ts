import type { H3Event } from "h3";
import BaseController from "~~/server/core/controllers/base.controller";
import AccountService from "~~/server/finance/services/account.service";

/* c8 ignore start */
export default class AccountController extends BaseController {
    static readonly deps = [AccountService];

    constructor(private readonly accountService: AccountService) {
        super();
    }

    public async getList(event: H3Event) {
        return await this.accountService.getList(event.context.user.id);
    }
}
/* c8 ignore stop */
