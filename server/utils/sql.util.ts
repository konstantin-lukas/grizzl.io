import TimerRepository from "~~/server/features/timer/repositories/timer.repository";
import { createContainer } from "~~/server/utils/di.util";

const SOFT_DELETABLE_REPOSITORIES = [TimerRepository];

export async function purgeAll(options: { maxAge: number }) {
    const { maxAge } = options;
    const container = createContainer();
    for (const softDeletableRepository of SOFT_DELETABLE_REPOSITORIES) {
        const repositoryInstance = container.resolve(softDeletableRepository);
        const { data, error } = await tryCatch(repositoryInstance.purge({ maxAge }));

        if (error) {
            console.error(
                `An error occurred while trying to purge table "${repositoryInstance.tableName}": ${error.message}`,
            );
            return;
        }

        if (typeof data !== "number") {
            console.error(
                `An error occurred while trying to purge table "${repositoryInstance.tableName}". Expected a number of deleted rows but got "${data}".`,
            );
            return;
        }

        console.log(`Successfully deleted ${data} rows while purging table "${repositoryInstance.tableName}".`);
    }
}
