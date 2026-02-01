import TimerController from "~~/server/controllers/timer.controller";
import { db } from "~~/server/database";
import TimerRepository from "~~/server/repositories/timer.repository";
import TimerService from "~~/server/services/timer.service";

export default defineEventHandler(async event => {
    const timerRepository = new TimerRepository(db);
    const timerService = new TimerService(timerRepository);
    const timerController = new TimerController(timerService);
    await timerController.setDeletedStatus(event);
});
