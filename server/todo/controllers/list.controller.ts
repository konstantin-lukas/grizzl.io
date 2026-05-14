import ListService from "#server/todo/services/list.service";
import type { H3Event } from "h3";
import BaseController from "~~/server/core/controllers/base.controller";

/* c8 ignore start */
export default class ListController extends BaseController {
    static readonly deps = [ListService];

    constructor(private readonly listService: ListService) {
        super();
    }

    public async getCollection(event: H3Event) {
        return await this.listService.getCollection(event.context.user.id);
    }
}
/* c8 ignore stop */
