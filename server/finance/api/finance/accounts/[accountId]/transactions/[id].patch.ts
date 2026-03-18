import TransactionController from "~~/server/finance/controllers/transaction.controller";

export default defineEventHandler(async event => {
    const transactionController = createContainer().resolve(TransactionController, event);
    await transactionController.setDeletedStatus(event);
});
