import { createDBConnection } from "@@/test-utils/database/connection";
import { truncate } from "@@/test-utils/database/truncate";
import { beforeEach } from "vitest";

beforeEach(async () => {
    const { db } = createDBConnection();
    await truncate(db, ["session"]);
});
