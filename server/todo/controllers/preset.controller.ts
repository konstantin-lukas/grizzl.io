import PresetService from "#server/todo/services/preset.service";
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
}
/* c8 ignore stop */
