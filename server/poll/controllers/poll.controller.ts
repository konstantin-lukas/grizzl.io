import BaseController from "#server/core/controllers/base.controller";
import PollService from "#server/poll/services/poll.service";
import type { H3Event } from "h3";

/* c8 ignore start */
export default class PollController extends BaseController {
    static readonly deps = [PollService];

    constructor(private readonly pollService: PollService) {
        super();
    }

    public async getCollection(event: H3Event) {
        return await this.pollService.getCollection(event.context.user.id);
    }
}
/* c8 ignore stop */
