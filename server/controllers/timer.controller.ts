import { DatabaseDeletedSchema } from "#shared/validators/deleted";
import { PostTimerSchema, PutTimerSchema } from "#shared/validators/timer";
import type { H3Event } from "h3";
import BaseController from "~~/server/controllers/base.controller";
import TimerService from "~~/server/services/timer.service";

export default class TimerController extends BaseController {
    static readonly deps = [TimerService];

    constructor(private readonly timerService: TimerService) {
        super();
    }

    public async setDeletedStatus(event: H3Event) {
        const id = BaseController.parseIdParameter(event);
        const body = await BaseController.parseRequestBody(event, DatabaseDeletedSchema);

        const result = await tryCatch(this.timerService.setDeletedStatus(id, event.context.user.id, body.deleted));

        BaseController.inferResponse(event, result);
    }

    public async update(event: H3Event) {
        const id = BaseController.parseIdParameter(event);
        const body = await BaseController.parseRequestBody(event, PutTimerSchema);

        const result = await tryCatch(this.timerService.update(id, event.context.user.id, body));

        BaseController.inferResponse(event, result);
    }

    public async getList(event: H3Event) {
        const result = await tryCatch(this.timerService.getList(event.context.user.id));

        BaseController.inferResponse(event, result);
        return result.data;
    }

    public async create(event: H3Event) {
        const timer = await BaseController.parseRequestBody(event, PostTimerSchema);
        const result = await tryCatch(this.timerService.create(event.context.user.id, timer));

        BaseController.inferResponse(event, result);
        setHeader(event, "Location", `/api/timers/${result.data}`);
    }
}
