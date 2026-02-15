import TimerController from "~~/server/features/timer/timer.controller";

export default defineEventHandler(async event => {
    const timerController = createContainer().resolve(TimerController, event);
    await timerController.create(event);
});
