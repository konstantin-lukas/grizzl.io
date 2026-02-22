import { PostTimerSchema, PutTimerSchema } from "#shared/features/timer/validators/timer.validator";
import { DatabaseDeletedSchema } from "#shared/validators/core.validator";
import type { H3Event } from "h3";
import BaseController from "~~/server/core/controllers/base.controller";
import TimerService from "~~/server/timer/services/timer.service";

/* c8 ignore start */
export default class TimerController extends BaseController {
    static readonly deps = [TimerService];

    constructor(private readonly timerService: TimerService) {
        super();
    }

    public async setDeletedStatus(event: H3Event) {
        const id = TimerController.parseIdParameter(event);
        const body = await TimerController.parseRequestBody(event, DatabaseDeletedSchema);
        await this.timerService.setDeletedStatus(id, event.context.user.id, body.deleted);
    }

    public async update(event: H3Event) {
        const id = TimerController.parseIdParameter(event);
        const body = await TimerController.parseRequestBody(event, PutTimerSchema);
        await this.timerService.update(id, event.context.user.id, body);
    }

    public async getList(event: H3Event) {
        return await this.timerService.getList(event.context.user.id);
    }

    public async create(event: H3Event) {
        const timer = await TimerController.parseRequestBody(event, PostTimerSchema);
        const data = await this.timerService.create(event.context.user.id, timer);
        setHeader(event, "Location", `/api/timers/${data}`);
    }
}
/* c8 ignore stop */
