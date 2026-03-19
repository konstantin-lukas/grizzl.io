import type { H3Event } from "h3";
import BaseController from "~~/server/core/controllers/base.controller";
import AutoTransactionService from "~~/server/finance/services/auto_transaction.service";

/* c8 ignore start */
export default class TransactionController extends BaseController {
    static readonly deps = [AutoTransactionService];

    constructor(private readonly autoTransactionService: AutoTransactionService) {
        super();
    }
    public async getList(event: H3Event) {
        const accountId = BaseController.parseIdParameter(event, "accountId");
        return this.autoTransactionService.getList(event.context.user.id, accountId);
    }
}
/* c8 ignore stop */
