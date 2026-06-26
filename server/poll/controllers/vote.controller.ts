import BaseController from "#server/core/controllers/base.controller";
import PollService from "#server/poll/services/poll.service";
import { nanoid } from "#shared/core/utils/id.util";
import { VOTER_IDENTIFIER_COOKIE_NAME } from "#shared/poll/constants/cookie.constant";
import { PostVoteSchema } from "#shared/poll/validators/vote.validator";
import type { H3Event } from "h3";

/* c8 ignore start */
export default class VoteController extends BaseController {
    static readonly deps = [PollService];

    constructor(private readonly pollService: PollService) {
        super();
    }

    public async post(event: H3Event) {
        const id = VoteController.parseIdParameter(event, "id");
        const body = await VoteController.parseRequestBody(event, PostVoteSchema);
        const ip = VoteController.getIpAddress(event);
        let cookie = getCookie(event, VOTER_IDENTIFIER_COOKIE_NAME);
        if (!cookie) {
            cookie = nanoid();
            setCookie(event, VOTER_IDENTIFIER_COOKIE_NAME, cookie);
        }
        await this.pollService.vote(id, body, ip, cookie);
    }
}
/* c8 ignore stop */
