import { DatabaseDeletedSchema } from "#shared/core/validators/core.validator";
import {
    GetTransactionFiltersSchema,
    PostTransactionSchema,
    PutTransactionSchema,
} from "#shared/finance/validators/transaction.validator";
import type { H3Event } from "h3";
import { z } from "zod";
import BaseController from "~~/server/core/controllers/base.controller";
import TransactionService from "~~/server/finance/services/transaction.service";

/* c8 ignore start */
export default class TransactionController extends BaseController {
    static readonly deps = [TransactionService];

    constructor(private readonly transactionService: TransactionService) {
        super();
    }

    public async setDeletedStatus(event: H3Event) {
        const id = TransactionController.parseIdParameter(event);
        const accountId = BaseController.parseIdParameter(event, "accountId");
        const body = await TransactionController.parseRequestBody(event, DatabaseDeletedSchema);
        await this.transactionService.setDeletedStatus(id, event.context.user.id, accountId, body.deleted);
    }

    public async getList(event: H3Event) {
        const accountId = BaseController.parseIdParameter(event, "accountId");
        const filters = z.parse(GetTransactionFiltersSchema, getQuery(event));
        return this.transactionService.getList(event.context.user.id, accountId, filters);
    }

    public async update(event: H3Event) {
        const id = TransactionController.parseIdParameter(event);
        const accountId = TransactionController.parseIdParameter(event, "accountId");
        const body = await TransactionController.parseRequestBody(event, PutTransactionSchema);
        await this.transactionService.update(id, event.context.user.id, accountId, body);
    }

    public async create(event: H3Event) {
        const transaction = await TransactionController.parseRequestBody(event, PostTransactionSchema);
        const accountId = BaseController.parseIdParameter(event, "accountId");
        const data = await this.transactionService.create(event.context.user.id, accountId, transaction);
        setHeader(event, "Location", `/api/finance/accounts/${accountId}/transactions/${data}`);
    }
}
/* c8 ignore stop */
