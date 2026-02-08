import { test as baseTest } from "vitest";
import { dbFixture, userFixture } from "~~/test-utils/database/fixture";

export * from "vitest";

export const test = baseTest.extend({
    db: dbFixture,
    user: userFixture,
});
