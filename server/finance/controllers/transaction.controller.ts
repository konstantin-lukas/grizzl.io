import { GetTransactionFiltersSchema, PostTransactionSchema } from "#shared/finance/validators/transaction.validator";
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

    public async getList(event: H3Event) {
        const accountId = BaseController.parseIdParameter(event, "accountId");
        const filters = z.parse(GetTransactionFiltersSchema, getQuery(event));
        return this.transactionService.getList(event.context.user.id, accountId, filters);
    }

    public async create(event: H3Event) {
        const transaction = await TransactionController.parseRequestBody(event, PostTransactionSchema);
        const accountId = BaseController.parseIdParameter(event, "accountId");
        const data = await this.transactionService.create(event.context.user.id, accountId, transaction);
        setHeader(event, "Location", `/api/finance/accounts/${accountId}/transactions/${data}`);
    }
}
/* c8 ignore stop */
