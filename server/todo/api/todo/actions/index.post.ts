import ActionController from "~~/server/todo/controllers/action.controller";

export default defineEventHandler(async event => {
    const listController = createContainer().resolve(ActionController, event);
    return listController.triggerActions(event);
});
