import select from "~~/server/utils/db/timer/select";

export default defineEventHandler(async event => {
    const { data, error } = await tryCatch(select(event.context.user.id));
    if (error) throwError(error);
    setStatus(event, "OK");
    return data;
});
