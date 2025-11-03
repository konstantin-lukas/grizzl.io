import { HttpStatusCode } from "#shared/enum/status";
import { TimerPostSchema } from "#shared/schema/timer";
import { parseRequestBody } from "~~/server/utils/schema";

export default defineEventHandler(async event => {
    const data = await parseRequestBody(event, TimerPostSchema);
    setResponseStatus(event, HttpStatusCode.CREATED, "Created");
    return { data };
});
