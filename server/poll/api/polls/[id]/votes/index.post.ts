import VoteController from "#server/poll/controllers/vote.controller";

export default defineEventHandler(async event => {
    const voteController = createContainer().resolve(VoteController, event);
    return voteController.post(event);
});
