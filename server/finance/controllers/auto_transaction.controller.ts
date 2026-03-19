import { PostAutoTransactionSchema } from "#shared/finance/validators/auto_transaction.validator";
import type { H3Event } from "h3";
import BaseController from "~~/server/core/controllers/base.controller";
import AutoTransactionService from "~~/server/finance/services/auto_transaction.service";

/* c8 ignore start */
export default class AutoTransactionController extends BaseController {
    static readonly deps = [AutoTransactionService];

    constructor(private readonly autoTransactionService: AutoTransactionService) {
        super();
    }

    public async getList(event: H3Event) {
        const accountId = BaseController.parseIdParameter(event, "accountId");
        return this.autoTransactionService.getList(event.context.user.id, accountId);
    }

    public async create(event: H3Event) {
        const autoTransaction = await BaseController.parseRequestBody(event, PostAutoTransactionSchema);
        const accountId = BaseController.parseIdParameter(event, "accountId");
        const data = await this.autoTransactionService.create(event.context.user.id, accountId, autoTransaction);
        setHeader(event, "Location", `/api/finance/accounts/${accountId}/auto-transactions/${data}`);
    }
}
/* c8 ignore stop */
