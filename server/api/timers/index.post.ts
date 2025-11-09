import { TimerSchema } from "#shared/schema/timer";
import insert from "~~/server/utils/db/timer/insert";
import { parseRequestBody } from "~~/server/utils/schema";

export default defineEventHandler(async event => {
    const timer = await parseRequestBody(event, TimerSchema);
    const { data, error } = await tryCatch(insert(event.context.user.id, timer));

    if (error) throwError(error, "UNPROCESSABLE_CONTENT");
    setStatus(event, "CREATED");

    return { data };
});
