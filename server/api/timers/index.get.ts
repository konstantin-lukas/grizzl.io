import { db } from "~~/server/database";
import TimerRepository from "~~/server/repositories/timer.repository";

export default defineEventHandler(async event => {
    const timerRepository = new TimerRepository(db);
    const data = await tryThrow(timerRepository.findByUserId(event.context.user.id));
    setStatus(event, "OK");
    return data;
});
