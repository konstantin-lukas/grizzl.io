import { GetTransactionFiltersSchema } from "#shared/finance/validators/transaction.validator";
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
}
/* c8 ignore stop */
