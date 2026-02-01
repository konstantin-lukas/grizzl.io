import { DatabaseDeletedSchema } from "#shared/validators/deleted";
import type { H3Event } from "h3";
import BaseController from "~~/server/controllers/base.controller";
import NotFoundError from "~~/server/errors/not-found-error";
import TimerService from "~~/server/services/timer.service";

export default class TimerController extends BaseController {
    static readonly deps = [TimerService];

    constructor(private readonly timerService: TimerService) {
        super();
    }

    public async setDeletedStatus(event: H3Event): Promise<void> {
        const id = await this.parseIdParameter(event);
        const body = await this.parseRequestBody(event, DatabaseDeletedSchema);
        const { error } = await tryCatch(this.timerService.setDeletedStatus(id, event.context.user.id, body.deleted));
        if (error instanceof NotFoundError) this.throwError("The provided ID was not found.", "NOT_FOUND");
        if (error) this.throwError(error, "UNPROCESSABLE_CONTENT", true);
        setStatus(event, "NO_CONTENT");
    }
}
