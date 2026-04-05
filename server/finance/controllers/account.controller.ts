import TransactionService from "#server/finance/services/transaction.service";
import { DatabaseDeletedSchema } from "#shared/core/validators/core.validator";
import { PostAccountSchema, PutAccountSchema } from "#shared/finance/validators/account.validator";
import { BaseTransactionFiltersSchema } from "#shared/finance/validators/transaction.validator";
import type { H3Event } from "h3";
import { z } from "zod";
import BaseController from "~~/server/core/controllers/base.controller";
import AccountService from "~~/server/finance/services/account.service";

/* c8 ignore start */
export default class AccountController extends BaseController {
    static readonly deps = [AccountService, TransactionService];

    constructor(
        private readonly accountService: AccountService,
        private readonly transactionService: TransactionService,
    ) {
        super();
    }

    public async setDeletedStatus(event: H3Event) {
        const id = AccountController.parseIdParameter(event, "accountId");
        const body = await AccountController.parseRequestBody(event, DatabaseDeletedSchema);
        await this.accountService.setDeletedStatus(id, event.context.user.id, body.deleted);
    }

    public async update(event: H3Event) {
        const id = AccountController.parseIdParameter(event, "accountId");
        const body = await AccountController.parseRequestBody(event, PutAccountSchema);
        await this.accountService.update(id, event.context.user.id, body);
    }

    public async getList(event: H3Event) {
        return await this.accountService.getList(event.context.user.id);
    }

    public async getBalance(event: H3Event) {
        const id = AccountController.parseIdParameter(event, "accountId");
        const filters = z.parse(BaseTransactionFiltersSchema, getQuery(event));
        return this.transactionService.getBalance(event.context.user.id, id, filters);
    }

    public async create(event: H3Event) {
        const account = await AccountController.parseRequestBody(event, PostAccountSchema);
        const data = await this.accountService.create(event.context.user.id, account);
        setHeader(event, "Location", `/api/finance/accounts/${data}`);
    }
}
/* c8 ignore stop */
