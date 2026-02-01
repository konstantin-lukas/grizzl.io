import NotFoundError from "~~/server/errors/not-found-error";
import TimerRepository from "~~/server/repositories/timer.repository";

export default class TimerService {
    static readonly deps = [TimerRepository];

    constructor(private readonly timerRepository: TimerRepository) {}

    public async setDeletedStatus(id: string, userId: string, isDeleted: boolean): Promise<void> {
        const operation = isDeleted ? "delete" : "undelete";
        const rowCount = await tryThrow(this.timerRepository[operation]({ id, userId }));
        if (rowCount === 0) throw new NotFoundError();
    }
}
