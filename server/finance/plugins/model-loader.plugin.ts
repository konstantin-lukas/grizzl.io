import { FeatureExtractionService } from "#server/finance/services/feature-extraction";

export default defineNitroPlugin(async () => {
    await FeatureExtractionService.initialize();
});
