import { PutTimerSchema } from "#shared/validators/timer";
import { db } from "~~/server/database";
import TimerRepository from "~~/server/repositories/timer.repository";

export default defineEventHandler(async event => {
    const id = await parseIdParameter(event);
    const body = await parseRequestBody(event, PutTimerSchema);
    const timerRepository = new TimerRepository(db);
    const rowCount = await tryThrow(timerRepository.update(id, event.context.user.id, body));
    if (rowCount === 0) throwError("The provided ID was not found.", "NOT_FOUND");
    setStatus(event, "NO_CONTENT");
});
