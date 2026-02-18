import TimerRepository from "~~/server/features/timer/repositories/timer.repository";
import { LoggerService } from "~~/server/services/logger.service";
import { createContainer } from "~~/server/utils/di.util";

const SOFT_DELETABLE_REPOSITORIES = [TimerRepository];

export async function purgeAll(options: { maxAge: number }) {
    const { maxAge } = options;
    const container = createContainer();
    const logger = container.resolve(LoggerService);
    for (const softDeletableRepository of SOFT_DELETABLE_REPOSITORIES) {
        const repositoryInstance = container.resolve(softDeletableRepository);

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
