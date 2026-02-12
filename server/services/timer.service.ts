import type { PostTimer, PutTimer } from "#shared/validators/timer";
import NotFoundError from "~~/server/errors/not-found-error";
import TimerRepository from "~~/server/repositories/timer.repository";

export default class TimerService {
    static readonly deps = [TimerRepository];

    constructor(private readonly timerRepository: TimerRepository) {}

    public async setDeletedStatus(id: string, userId: string, isDeleted: boolean) {
        const operation = isDeleted ? "delete" : "undelete";
        const rowCount = await this.timerRepository[operation]({ id, userId });
        if (rowCount === 0) {
            const logMessage = `Unable to ${operation} timer with id ${id} and ${userId}.`;
            return err(new NotFoundError("logMessage", logMessage));
        }
        return ok();
    }

    public async update(id: string, userId: string, timer: PutTimer) {
        const rowCount = await this.timerRepository.update(id, userId, timer);
        if (rowCount === 0) {
            const logMessage = `Unable to update timer with id ${id} and ${userId}.`;
            return err(new NotFoundError("logMessage", logMessage));
        }
        return ok();
    }

    /* c8 ignore start */
    public async getList(userId: string) {
        return ok(await this.timerRepository.findByUserId(userId));
    }

    public async create(userId: string, timer: PostTimer) {
        return ok(await this.timerRepository.create(userId, timer));
    }
    /* c8 ignore stop */
}
