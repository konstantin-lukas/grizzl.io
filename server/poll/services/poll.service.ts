import PollRepository from "#server/poll/repositories/poll.repository";

export default class PollService {
    static readonly deps = [PollRepository];

    constructor(private readonly pollRepository: PollRepository) {}

    /* c8 ignore start */
    async getCollection(userId: string) {
        return this.pollRepository.findByUserId(userId);
    }
    /* c8 ignore stop */
}
