import AutoTransactionController from "#server/finance/controllers/auto-transaction.controller";

export default defineEventHandler(async event => {
    const autoTransactionController = createContainer().resolve(AutoTransactionController, event);
    return autoTransactionController.create(event);
});
