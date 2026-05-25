import ActionController from "~~/server/todo/controllers/action.controller";

export default defineEventHandler(async event => {
    const actionController = createContainer().resolve(ActionController, event);
    return actionController.triggerActions(event);
});
