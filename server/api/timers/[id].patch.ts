import { DatabaseDeletedSchema } from "#shared/schema/deleted";
import update from "~~/server/utils/db/timer/update";

export default defineEventHandler(async event => {
    const id = await parseIdParameter(event);
    const body = await parseRequestBody(event, DatabaseDeletedSchema);
    const data = await tryThrow(update(id, event.context.user.id, body));
    if (data.rowCount === 0) throwError("The provided ID was not found.", "NOT_FOUND");
    setStatus(event, "NO_CONTENT");
});
