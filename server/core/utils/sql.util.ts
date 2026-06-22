import type BaseRepository from "#server/core/repositories/base.repository";
import AccountRepository from "#server/finance/repositories/account.repository";
import AutoTransactionRepository from "#server/finance/repositories/auto-transaction.repository";
import TransactionRepository from "#server/finance/repositories/transaction.repository";
import PollRepository from "#server/poll/repositories/poll.repository";
import ListRepository from "#server/todo/repositories/list.repository";
import PresetRepository from "#server/todo/repositories/preset.repository";
import { tryCatch } from "#shared/core/utils/result.util";
import { type SQLWrapper, and, eq, exists, isNull } from "drizzle-orm";
import type { Database } from "~~/database";
import LoggerService from "~~/server/core/services/logger.service";
import { createContainer } from "~~/server/core/utils/di.util";
import TimerRepository from "~~/server/timer/repositories/timer.repository";

const SOFT_DELETABLE_REPOSITORIES = [
    TimerRepository,
    AccountRepository,
    TransactionRepository,
    AutoTransactionRepository,
    ListRepository,
    PresetRepository,
    PollRepository,
];

export async function purgeAll(options: { maxAge: number }) {
    const { maxAge } = options;
    const container = createContainer();
    const logger = container.resolve(LoggerService);
    for (const softDeletableRepository of SOFT_DELETABLE_REPOSITORIES) {
        const repositoryInstance = container.resolve(softDeletableRepository as never) as BaseRepository<never>;

        if (!repositoryInstance.isSoftDeletable) {
            logger.warn(`Attempting to purge table that is not soft-deletable: "${repositoryInstance.tableName}".`);
            return;
        }

        const { data, error } = await tryCatch(repositoryInstance.purge({ maxAge }));

        if (error) {
            logger.error(
                `An error occurred while trying to purge table "${repositoryInstance.tableName}": ${error.message}`,
            );
            return;
        }

        if (typeof data !== "number") {
            logger.error(
                `An error occurred while trying to purge table "${repositoryInstance.tableName}". Expected a number of deleted rows but got "${data}".`,
            );
            return;
        }

        logger.info(`Successfully deleted ${data} rows while purging table "${repositoryInstance.tableName}".`);
    }
}

/* c8 ignore start */
export function transitiveOwnership(
    userId: string,
    db: Database,
    selfSchema: { id: SQLWrapper; userId: SQLWrapper; deletedAt: SQLWrapper },
    parentId: SQLWrapper,
) {
    return exists(
        db
            .select()
            .from(selfSchema as never)
            .where(and(eq(selfSchema.id, parentId), eq(selfSchema.userId, userId), isNull(selfSchema.deletedAt))),
    );
}
/* c8 ignore stop */
