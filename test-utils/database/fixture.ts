import type { drizzle } from "drizzle-orm/node-postgres";
import { createDBConnection } from "~~/test-utils/database/connection";
import AccountFixture from "~~/test-utils/fixtures/account.fixture";
import FinanceAccountFixture from "~~/test-utils/fixtures/finance-account.fixture";
import FinanceAutoTransactionFixture from "~~/test-utils/fixtures/finance-auto-transaction.fixture";
import FinanceCategoryFixture from "~~/test-utils/fixtures/finance-category.fixture";
import FinanceTransactionFixture from "~~/test-utils/fixtures/finance-transaction.fixture";
import TimerIntervalFixture from "~~/test-utils/fixtures/timer-interval.fixture";
import TimerFixture from "~~/test-utils/fixtures/timer.fixture";
import UserFixture from "~~/test-utils/fixtures/user.fixture";

function createDBFixtures(db: ReturnType<typeof drizzle>) {
    return {
        timer: new TimerFixture(db),
        timerInterval: new TimerIntervalFixture(db),
        financeAccount: new FinanceAccountFixture(db),
        financeCategory: new FinanceCategoryFixture(db),
        financeTransaction: new FinanceTransactionFixture(db),
        financeAutoTransaction: new FinanceAutoTransactionFixture(db),
        user: new UserFixture(db),
        account: new AccountFixture(db),
        client: db,
    };
}

export type DBFixtures = ReturnType<typeof createDBFixtures>;

// eslint-disable-next-line no-empty-pattern
export async function dbFixture({}, waitForUse: (value: DBFixtures) => Promise<void>) {
    const { pool, db } = createDBConnection();

    await waitForUse(createDBFixtures(db));

    await pool.end();
}

async function createUser(db: ReturnType<typeof drizzle>) {
    const userFixture = new UserFixture(db);
    return (await userFixture.insert(1))[0];
}

type User = Awaited<ReturnType<typeof createUser>>;

// eslint-disable-next-line no-empty-pattern
export async function userFixture({}, waitForUse: (value: User) => Promise<void>) {
    const { db, pool } = createDBConnection();
    const user = await createUser(db);

    await waitForUse(user);

    await pool.end();
}
