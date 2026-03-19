import AutoTransactionController from "~~/server/finance/controllers/auto_transaction.controller";

export default defineEventHandler(async event => {
    const autoTransactionController = createContainer().resolve(AutoTransactionController, event);
    return autoTransactionController.getList(event);
});
