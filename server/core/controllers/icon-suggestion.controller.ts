import BaseController from "#server/core/controllers/base.controller";
import { FeatureExtractionService } from "#server/core/services/feature-extraction.service";
import { CategoryIconSuggestionSchema } from "#shared/finance/validators/category.validator";
import type { H3Event } from "h3";

/* c8 ignore start */
export default class IconSuggestionController extends BaseController {
    static readonly deps = [];

    public async getIconSuggestion(event: H3Event) {
        const { categoryName } = CategoryIconSuggestionSchema.parse(getQuery(event));
        const fallbackIcon = "question-mark-rounded";
        const fallbackReturnValue = { icon: fallbackIcon };

        if (categoryName === "") return fallbackReturnValue;

        const result = await FeatureExtractionService.getClosestMatch(categoryName);

        if (!result?.icon || result.similarity < 0.25) return fallbackReturnValue;

        return { icon: result.icon };
    }
}
/* c8 ignore stop */
