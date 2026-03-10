import AccountController from "~~/server/finance/controllers/account.controller";

export default defineEventHandler(async event => {
    const accountController = createContainer().resolve(AccountController, event);
    await accountController.create(event);
});
