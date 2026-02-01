import type { PostTimer, PutTimer } from "#shared/validators/timer";
import NotFoundError from "~~/server/errors/not-found-error";
import TimerRepository from "~~/server/repositories/timer.repository";

export default class TimerService {
    static readonly deps = [TimerRepository];

    constructor(private readonly timerRepository: TimerRepository) {}

    public async setDeletedStatus(id: string, userId: string, isDeleted: boolean) {
        const operation = isDeleted ? "delete" : "undelete";
        const rowCount = await tryThrow(this.timerRepository[operation]({ id, userId }));
        if (rowCount === 0) throw new NotFoundError();
    }

    public async update(id: string, userId: string, timer: PutTimer) {
        const rowCount = await this.timerRepository.update(id, userId, timer);
        if (rowCount === 0) throw new NotFoundError();
    }

    public async getList(userId: string) {
        return this.timerRepository.findByUserId(userId);
    }

    public async create(userId: string, timer: PostTimer) {
        return this.timerRepository.create(userId, timer);
    }
}
