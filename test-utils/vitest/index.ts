import { test as baseTest } from "vitest";
import { dbFixture } from "~~/test-utils/database/fixture";

export const test = baseTest.extend({
    db: dbFixture,
});
