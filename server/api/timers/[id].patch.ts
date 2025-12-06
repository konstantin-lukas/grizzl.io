import { DatabaseDeletedSchema } from "#shared/schema/deleted";
import update from "~~/server/query/timer/update";

export default defineEventHandler(async event => {
    const id = await parseIdParameter(event);
    const body = await parseRequestBody(event, DatabaseDeletedSchema);
    const rowCount = await tryThrow(update(id, event.context.user.id, body));
    if (rowCount === 0) throwError("The provided ID was not found.", "NOT_FOUND");
    setStatus(event, "NO_CONTENT");
});
