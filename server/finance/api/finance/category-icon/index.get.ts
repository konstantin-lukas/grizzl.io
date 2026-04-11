import { FeatureExtractionService } from "#server/finance/services/feature-extraction";

export default defineEventHandler(async () => {
    const response = await FeatureExtractionService.getClosestMatch("Groceries");
    return { data: response };
});
