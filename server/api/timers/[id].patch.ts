import TimerController from "~~/server/controllers/timer.controller";

export default defineEventHandler(async event => {
    const container = createContainer();
    const timerController = container.resolve(TimerController);
    await timerController.setDeletedStatus(event);
});
