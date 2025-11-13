import select from "~~/server/utils/db/timer/select";

export default defineEventHandler(async event => {
    const data = await tryThrow(select(event.context.user.id));
    setStatus(event, "OK");
    return data;
});
