import PollController from "#server/poll/controllers/poll.controller";

export default defineEventHandler(async event => {
    const pollController = createContainer().resolve(PollController, event);
    return pollController.get(event);
});
