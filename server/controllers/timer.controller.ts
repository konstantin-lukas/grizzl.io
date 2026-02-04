import { DatabaseDeletedSchema } from "#shared/validators/deleted";
import { PostTimerSchema, PutTimerSchema } from "#shared/validators/timer";
import type { H3Event } from "h3";
import BaseController from "~~/server/controllers/base.controller";
import TimerService from "~~/server/services/timer.service";

/* c8 ignore start */
export default class TimerController extends BaseController {
    static readonly deps = [TimerService];

    constructor(private readonly timerService: TimerService) {
        super();
    }

    public async setDeletedStatus(event: H3Event) {
        const id = TimerController.parseIdParameter(event);
        const body = await TimerController.parseRequestBody(event, DatabaseDeletedSchema);

        const result = await tryCatch(this.timerService.setDeletedStatus(id, event.context.user.id, body.deleted));

        TimerController.inferResponse(event, result);
    }

    public async update(event: H3Event) {
        const id = TimerController.parseIdParameter(event);
        const body = await TimerController.parseRequestBody(event, PutTimerSchema);

        const result = await tryCatch(this.timerService.update(id, event.context.user.id, body));

        TimerController.inferResponse(event, result);
    }

    public async getList(event: H3Event) {
        const result = await tryCatch(this.timerService.getList(event.context.user.id));

        TimerController.inferResponse(event, result);
        return result.data;
    }

    public async create(event: H3Event) {
        const timer = await TimerController.parseRequestBody(event, PostTimerSchema);
        const result = await tryCatch(this.timerService.create(event.context.user.id, timer));

        TimerController.inferResponse(event, result);
        setHeader(event, "Location", `/api/timers/${result.data}`);
    }
}
/* c8 ignore stop */
