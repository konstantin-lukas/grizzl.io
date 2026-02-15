import TimerController from "~~/server/features/timer/controllers/timer.controller";

export default defineEventHandler(async event => {
    const timerController = createContainer().resolve(TimerController, event);
    await timerController.update(event);
});
