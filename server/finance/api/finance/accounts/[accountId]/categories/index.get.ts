import CategoryController from "#server/finance/controllers/category.controller";

export default defineEventHandler(async event => {
    const categoryController = createContainer().resolve(CategoryController, event);
    return categoryController.getList(event);
});
