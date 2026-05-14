import ListController from "~~/server/todo/controllers/list.controller";

export default defineEventHandler(async event => {
    const listController = createContainer().resolve(ListController, event);
    return listController.getCollection(event);
});
