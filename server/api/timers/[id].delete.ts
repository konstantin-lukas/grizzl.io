import del from "~~/server/utils/db/timer/del";

export default defineEventHandler(async event => {
    const id = await parseIdParameter(event);
    const data = await tryThrow(del(id, event.context.user.id));
    if (data.rowCount === 0) throwError("The provided ID was not found.", "NOT_FOUND");
    setStatus(event, "NO_CONTENT");
});
