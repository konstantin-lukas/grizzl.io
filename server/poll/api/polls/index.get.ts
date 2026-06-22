import PollController from "#server/poll/controllers/poll.controller";

export default defineEventHandler(async event => {
    const listController = createContainer().resolve(PollController, event);
    return listController.getCollection(event);
});
