import PresetService from "#server/todo/services/preset.service";
import { DatabaseDeletedSchema } from "#shared/core/validators/core.validator";
import { PostPresetSchema, PutPresetSchema } from "#shared/todo/validators/preset.validator";
import type { H3Event } from "h3";
import BaseController from "~~/server/core/controllers/base.controller";

/* c8 ignore start */
export default class PresetController extends BaseController {
    static readonly deps = [PresetService];

    constructor(private readonly presetService: PresetService) {
        super();
    }

    public async getCollection(event: H3Event) {
        const id = PresetController.parseIdParameter(event, "listId");
        return await this.presetService.getList(event.context.user.id, id);
    }

    public async create(event: H3Event) {
        const body = await PresetController.parseRequestBody(event, PostPresetSchema);
        const listId = PresetController.parseIdParameter(event, "listId");
        const data = await this.presetService.create(event.context.user.id, listId, body);
        setHeader(event, "Location", `/api/todo/lists/${listId}/presets/${data}`);
    }

    public async update(event: H3Event) {
        const body = await PresetController.parseRequestBody(event, PutPresetSchema);
        const listId = PresetController.parseIdParameter(event, "listId");
        const id = PresetController.parseIdParameter(event);
        return await this.presetService.update(id, listId, event.context.user.id, body);
    }

    public async setDeletedStatus(event: H3Event) {
        const id = BaseController.parseIdParameter(event);
        const listId = BaseController.parseIdParameter(event, "listId");
        const body = await BaseController.parseRequestBody(event, DatabaseDeletedSchema);
        await this.presetService.setDeletedStatus(id, listId, event.context.user.id, body.deleted);
    }
}
/* c8 ignore stop */
