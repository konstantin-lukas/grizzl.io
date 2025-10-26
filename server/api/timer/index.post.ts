import { HttpStatusCode } from "#shared/enum/status";
import { TimerPostSchema } from "#shared/schema/timer";
import { safeParseRequestBody } from "~~/server/utils/schema";

export default defineEventHandler(async event => {
    const { success, data, error } = await safeParseRequestBody(event, TimerPostSchema);
    setResponseStatus(event, HttpStatusCode.CREATED);
    return { success, data, error };
});
