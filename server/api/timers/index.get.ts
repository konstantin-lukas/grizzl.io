import TimerController from "~~/server/controllers/timer.controller";

export default defineEventHandler(async event => {
    const timerController = createContainer().resolve(TimerController);
    return timerController.getList(event);
});
