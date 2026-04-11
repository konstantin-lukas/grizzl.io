import { FeatureExtractionService } from "#server/finance/services/feature-extraction.service";
import { CategoryIconSuggestionSchema } from "#shared/finance/validators/category.validator";
import type { H3Event } from "h3";
import BaseController from "~~/server/core/controllers/base.controller";

/* c8 ignore start */
export default class CategoryIconController extends BaseController {
    static readonly deps = [];

    public async getIconSuggestion(event: H3Event) {
        const { categoryName } = CategoryIconSuggestionSchema.parse(getQuery(event));
        const fallbackIcon = "question-mark-rounded";
        const fallbackReturnValue = { icon: fallbackIcon };

        if (categoryName === "") return fallbackReturnValue;

        const result = await FeatureExtractionService.getClosestMatch(categoryName);

        if (!result?.icon || result.similarity < 0.3) return fallbackReturnValue;

        return { icon: result.icon };
    }
}
/* c8 ignore stop */
