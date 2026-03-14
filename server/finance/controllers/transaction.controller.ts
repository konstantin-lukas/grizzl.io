import type { H3Event } from "h3";
import BaseController from "~~/server/core/controllers/base.controller";
import TransactionService from "~~/server/finance/services/transaction.service";

/* c8 ignore start */
export default class TransactionController extends BaseController {
    static readonly deps = [TransactionService];

    constructor(private readonly transactionService: TransactionService) {
        super();
    }

    public async getList(event: H3Event) {
        const accountId = BaseController.parseIdParameter(event, "accountId");
        return this.transactionService.getList(event.context.user.id, accountId);
    }
}
/* c8 ignore stop */
