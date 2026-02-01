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
        const id = this.parseIdParameter(event);
        const body = await this.parseRequestBody(event, DatabaseDeletedSchema);

        const result = await tryCatch(this.timerService.setDeletedStatus(id, event.context.user.id, body.deleted));

        this.inferResponse(event, result);
    }

    public async update(event: H3Event) {
        const id = this.parseIdParameter(event);
        const body = await this.parseRequestBody(event, PutTimerSchema);

        const result = await tryCatch(this.timerService.update(id, event.context.user.id, body));

        this.inferResponse(event, result);
    }

    public async getList(event: H3Event) {
        const result = await tryCatch(this.timerService.getList(event.context.user.id));

        this.inferResponse(event, result);
        return result.data;
    }

    public async create(event: H3Event) {
        const timer = await this.parseRequestBody(event, PostTimerSchema);
        const result = await tryCatch(this.timerService.create(event.context.user.id, timer));

        this.inferResponse(event, result);
        setHeader(event, "Location", `/api/timers/${result.data}`);
    }
}
