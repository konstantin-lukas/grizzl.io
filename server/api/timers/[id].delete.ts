import del from "~~/server/utils/db/timer/del";

export default defineEventHandler(async event => {
    const id = await parseIdParameter(event);
    const { data, error } = await tryCatch(del(id, event.context.user.id));
    if (error) throwError(error, "UNPROCESSABLE_CONTENT");
    if (data.rowCount === 0) throwError("The provided ID was not found.", "NOT_FOUND");
});
