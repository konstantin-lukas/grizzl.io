import ListService from "#server/todo/services/list.service";
import { DatabaseDeletedSchema } from "#shared/core/validators/core.validator";
import { PostListSchema, PutListSchema } from "#shared/todo/validators/list.validator";
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

    public async setDeletedStatus(event: H3Event) {
        const id = ListController.parseIdParameter(event, "listId");
        const body = await ListController.parseRequestBody(event, DatabaseDeletedSchema);
        await this.listService.setDeletedStatus(id, event.context.user.id, body.deleted);
    }

    public async create(event: H3Event) {
        const body = await ListController.parseRequestBody(event, PostListSchema);
        const data = await this.listService.create(event.context.user.id, body);
        setHeader(event, "Location", `/api/todo/lists/${data}`);
    }

    public async update(event: H3Event) {
        const id = ListController.parseIdParameter(event, "listId");
        const body = await ListController.parseRequestBody(event, PutListSchema);
        await this.listService.update(id, event.context.user.id, body);
    }
}
/* c8 ignore stop */
