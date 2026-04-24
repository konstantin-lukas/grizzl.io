import { FeatureExtractionService } from "#server/finance/services/feature-extraction.service";

export default defineNitroPlugin(async () => {
    // This runtime logic was added to avoid using git lfs budget in CI workflow
    const runtimeConfig = useRuntimeConfig();
    if (runtimeConfig.public.appEnv === "test") return;

    await FeatureExtractionService.initialize();
});
