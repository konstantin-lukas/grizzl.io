import { PostAccountSchema } from "#shared/finance/validators/account.validator";
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

    public async create(event: H3Event) {
        const account = await AccountController.parseRequestBody(event, PostAccountSchema);
        const data = await this.accountService.create(event.context.user.id, account);
        setHeader(event, "Location", `/api/finance/accounts/${data}`);
    }
}
/* c8 ignore stop */
