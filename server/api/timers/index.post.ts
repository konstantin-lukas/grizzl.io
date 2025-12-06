import { PostTimerSchema } from "#shared/schema/timer";
import insert from "~~/server/query/timer/insert";
import { parseRequestBody } from "~~/server/utils/schema";

export default defineEventHandler(async event => {
    const timer = await parseRequestBody(event, PostTimerSchema);
    const data = await tryThrow(insert(event.context.user.id, timer));
    setStatus(event, "CREATED");
    return { data };
});
