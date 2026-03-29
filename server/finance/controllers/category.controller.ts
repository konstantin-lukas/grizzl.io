import CategoryService from "#server/finance/services/category.service";
import type { H3Event } from "h3";
import BaseController from "~~/server/core/controllers/base.controller";

/* c8 ignore start */
export default class CategoryController extends BaseController {
    static readonly deps = [CategoryService];

    constructor(private readonly categoryService: CategoryService) {
        super();
    }

    public async getList(event: H3Event) {
        const accountId = BaseController.parseIdParameter(event, "accountId");
        return this.categoryService.getList(event.context.user.id, accountId);
    }
}
/* c8 ignore stop */
