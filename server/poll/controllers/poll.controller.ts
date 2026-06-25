import BaseController from "#server/core/controllers/base.controller";
import PollService from "#server/poll/services/poll.service";
import { VOTER_IDENTIFIER_COOKIE_NAME } from "#shared/poll/constants/cookie.constant";
import { PostPollSchema } from "#shared/poll/validators/poll.validator";
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

    public async get(event: H3Event) {
        const ip = PollController.getIpAddress(event);
        const cookie = getCookie(event, VOTER_IDENTIFIER_COOKIE_NAME);
        const id = PollController.parseIdParameter(event);
        return await this.pollService.getOne(id, ip, cookie);
    }

    public async post(event: H3Event) {
        const body = await PollController.parseRequestBody(event, PostPollSchema);
        const id = await this.pollService.create(event.context.user.id, body);
        setHeader(event, "Location", `/api/polls/${id}`);
    }
}
/* c8 ignore stop */
