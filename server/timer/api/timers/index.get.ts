import TimerController from "~~/server/timer/controllers/timer.controller";

export default defineEventHandler(async event => {
    const timerController = createContainer().resolve(TimerController, event);
    return timerController.getList(event);
});
