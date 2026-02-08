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
        const servicePromise = this.timerService.setDeletedStatus(id, event.context.user.id, body.deleted);
        await TimerController.resolveOrThrowHttpError(event, servicePromise);
    }

    public async update(event: H3Event) {
        const id = TimerController.parseIdParameter(event);
        const body = await TimerController.parseRequestBody(event, PutTimerSchema);
        const servicePromise = this.timerService.update(id, event.context.user.id, body);
        await TimerController.resolveOrThrowHttpError(event, servicePromise);
    }

    public async getList(event: H3Event) {
        const servicePromise = this.timerService.getList(event.context.user.id);
        return await TimerController.resolveOrThrowHttpError(event, servicePromise);
    }

    public async create(event: H3Event) {
        const timer = await TimerController.parseRequestBody(event, PostTimerSchema);
        const servicePromise = this.timerService.create(event.context.user.id, timer);
        const id = await TimerController.resolveOrThrowHttpError(event, servicePromise);
        setHeader(event, "Location", `/api/timers/${id}`);
    }
}
/* c8 ignore stop */
