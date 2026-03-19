import { DatabaseDeletedSchema } from "#shared/core/validators/core.validator";
import {
    PostAutoTransactionSchema,
    PutAutoTransactionSchema,
} from "#shared/finance/validators/auto_transaction.validator";
import type { H3Event } from "h3";
import BaseController from "~~/server/core/controllers/base.controller";
import AutoTransactionService from "~~/server/finance/services/auto_transaction.service";

/* c8 ignore start */
export default class AutoTransactionController extends BaseController {
    static readonly deps = [AutoTransactionService];

    constructor(private readonly autoTransactionService: AutoTransactionService) {
        super();
    }

    public async setDeletedStatus(event: H3Event) {
        const id = BaseController.parseIdParameter(event);
        const body = await BaseController.parseRequestBody(event, DatabaseDeletedSchema);
        await this.autoTransactionService.setDeletedStatus(id, event.context.user.id, body.deleted);
    }

    public async getList(event: H3Event) {
        const accountId = BaseController.parseIdParameter(event, "accountId");
        return this.autoTransactionService.getList(event.context.user.id, accountId);
    }

    public async update(event: H3Event) {
        const id = BaseController.parseIdParameter(event);
        const accountId = BaseController.parseIdParameter(event, "accountId");
        const autoTransaction = await BaseController.parseRequestBody(event, PutAutoTransactionSchema);
        return this.autoTransactionService.update(id, event.context.user.id, accountId, autoTransaction);
    }

    public async create(event: H3Event) {
        const autoTransaction = await BaseController.parseRequestBody(event, PostAutoTransactionSchema);
        const accountId = BaseController.parseIdParameter(event, "accountId");
        const data = await this.autoTransactionService.create(event.context.user.id, accountId, autoTransaction);
        setHeader(event, "Location", `/api/finance/accounts/${accountId}/auto-transactions/${data}`);
    }
}
/* c8 ignore stop */
