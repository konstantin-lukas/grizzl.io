import PresetController from "#server/todo/controllers/preset.controller";

export default defineEventHandler(async event => {
    const presetController = createContainer().resolve(PresetController, event);
    return presetController.getCollection(event);
});
