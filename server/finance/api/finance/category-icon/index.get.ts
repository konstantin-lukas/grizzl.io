import CategoryIconController from "#server/finance/controllers/category-icon.controller";

export default defineEventHandler(async event => {
    const categoryIconController = createContainer().resolve(CategoryIconController, event);
    return categoryIconController.getIconSuggestion(event);
});
