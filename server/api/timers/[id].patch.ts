import { DatabaseDeletedSchema } from "#shared/validators/deleted";
import { db } from "~~/server/database";
import TimerRepository from "~~/server/repositories/timer.repository";

export default defineEventHandler(async event => {
    const id = await parseIdParameter(event);
    const body = await parseRequestBody(event, DatabaseDeletedSchema);
    const timerRepository = new TimerRepository(db);
    const operation = body.deleted ? "delete" : "undelete";
    const rowCount = await tryThrow(timerRepository[operation]({ id, userId: event.context.user.id }));
    if (rowCount === 0) throwError("The provided ID was not found.", "NOT_FOUND");
    setStatus(event, "NO_CONTENT");
});
