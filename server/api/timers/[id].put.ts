import { TimerSchema } from "#shared/schema/timer";
import update from "~~/server/utils/db/timer/update";
import { parseRequestBody } from "~~/server/utils/schema";

export default defineEventHandler(async event => {
    const id = await parseIdParameter(event);
    const body = await parseRequestBody(event, TimerSchema);
    const rowCount = await tryThrow(update(id, event.context.user.id, body));
    if (rowCount === 0) throwError("The provided ID was not found.", "NOT_FOUND");
    setStatus(event, "NO_CONTENT");
});
