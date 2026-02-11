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
        const { error } = await this.timerService.setDeletedStatus(id, event.context.user.id, body.deleted);
        TimerController.mapDomainResultToHttp(event, error);
    }

    public async update(event: H3Event) {
        const id = TimerController.parseIdParameter(event);
        const body = await TimerController.parseRequestBody(event, PutTimerSchema);
        const { error } = await this.timerService.update(id, event.context.user.id, body);
        TimerController.mapDomainResultToHttp(event, error);
    }

    public async getList(event: H3Event) {
        const { data, error } = await this.timerService.getList(event.context.user.id);
        TimerController.mapDomainResultToHttp(event, error);
        return data;
    }

    public async create(event: H3Event) {
        const timer = await TimerController.parseRequestBody(event, PostTimerSchema);
        const { data, error } = await this.timerService.create(event.context.user.id, timer);
        TimerController.mapDomainResultToHttp(event, error);
        setHeader(event, "Location", `/api/timers/${data}`);
    }
}
/* c8 ignore stop */
