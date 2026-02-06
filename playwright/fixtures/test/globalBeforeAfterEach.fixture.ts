import { createDBConnection } from "~~/fixtures";
import { truncate } from "~~/test-utils/database/truncate";

/**
 * This fixture serves as a global beforeEach/afterEach because Playwright currently doesn't have one.
 * There's no point importing this in a test. Any code you put before the waitForUse call is executed before each test
 * and before each beforeEach block in that test file. Code inserted after the waitForUse call acts as a global afterEach.
 */
export default function globalBeforeAfterEach() {
    // eslint-disable-next-line no-empty-pattern
    return async ({}, waitForUse: () => Promise<void>) => {
        const { pool, db } = createDBConnection();
        await truncate(db);

        await waitForUse();

        await pool.end();
    };
}
