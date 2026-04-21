import CategoryIconController from "#server/finance/controllers/category-icon.controller";

export default defineEventHandler(async event => {
    const runtimeConfig = useRuntimeConfig();
    if (runtimeConfig.public.appEnv === "test") {
        return { icon: "grocery" };
    }
    const categoryIconController = createContainer().resolve(CategoryIconController, event);
    return categoryIconController.getIconSuggestion(event);
});
