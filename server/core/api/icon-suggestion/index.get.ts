import IconSuggestionController from "#server/core/controllers/icon-suggestion.controller";

export default defineEventHandler(async event => {
    const runtimeConfig = useRuntimeConfig();
    if (runtimeConfig.public.appEnv === "test") {
        // This runtime logic was added to avoid using git lfs budget in CI workflow
        const params = getQuery(event);
        if (params["categoryName"] === undefined) {
            throw createError({
                statusCode: 400,
            });
        }
        if (params["categoryName"]?.toString().startsWith("Dog")) return { icon: "pet-supplies-outline" };
        return { icon: "question-mark-rounded" };
    }
    const categoryIconController = createContainer().resolve(IconSuggestionController, event);
    return categoryIconController.getIconSuggestion(event);
});
