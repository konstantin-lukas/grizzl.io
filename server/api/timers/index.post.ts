import { TimerSchema } from "#shared/schema/timer";
import insert from "~~/server/utils/db/timer/insert";
import { parseRequestBody } from "~~/server/utils/schema";

export default defineEventHandler(async event => {
    const timer = await parseRequestBody(event, TimerSchema);
    const data = await tryThrow(insert(event.context.user.id, timer));
    setStatus(event, "CREATED");
    return { data };
});
