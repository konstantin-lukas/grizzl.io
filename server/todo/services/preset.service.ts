import PresetRepository from "#server/todo/repositories/preset.repository";

export default class PresetService {
    static readonly deps = [PresetRepository];

    constructor(private readonly presetRepository: PresetRepository) {}

    /* c8 ignore start */
    public async getList(userId: string, listId: string) {
        return this.presetRepository.findByUserAndListId(userId, listId);
    }
    /* c8 ignore stop */
}
