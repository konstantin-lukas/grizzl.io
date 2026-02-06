// vitest.setup.ts
import { createDBConnection } from "../../fixtures";
import { truncate } from "../database/truncate";
import { beforeEach } from "vitest";

beforeEach(async () => {
    const { db } = createDBConnection();
    await truncate(db, ["account", "session"]);
});
