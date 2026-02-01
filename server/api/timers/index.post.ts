import { PostTimerSchema } from "#shared/validators/timer";
import { db } from "~~/server/database";
import TimerRepository from "~~/server/repositories/timer.repository";
import { parseRequestBody } from "~~/server/utils/schema";

export default defineEventHandler(async event => {
    const timer = await parseRequestBody(event, PostTimerSchema);
    const timerRepository = new TimerRepository(db);
    const data = await tryThrow(timerRepository.create(event.context.user.id, timer));
    setStatus(event, "CREATED");
    setHeader(event, "Location", `/api/timers/${data}`);
});
