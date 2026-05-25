import ActionService from "#server/todo/services/action.service";
import { PostActionQueueSchema } from "#shared/todo/validators/action.validator";
import type { H3Event } from "h3";
import BaseController from "~~/server/core/controllers/base.controller";

/* c8 ignore start */
export default class ActionController extends BaseController {
    static readonly deps = [ActionService];

    constructor(private readonly actionService: ActionService) {
        super();
    }

    public async triggerActions(event: H3Event) {
        const actions = await ActionController.parseRequestBody(event, PostActionQueueSchema);
        await this.actionService.processActions(event.context.user.id, actions);
    }
}
/* c8 ignore stop */
