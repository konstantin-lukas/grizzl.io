import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { expect, test } from "vitest";

function readMigrationFiles() {
    const migrationsDirectory = path.resolve(__dirname, "../../lib/db/migrations");
    return fs
        .readdirSync(migrationsDirectory)
        .filter(dir => dir.endsWith(".sql"))
        .sort();
}

test("should match schemas", () => {
    const migrationsBefore = readMigrationFiles();
    execSync("npx drizzle-kit generate");
    const migrationsAfter = readMigrationFiles();
    expect(migrationsBefore.length).toBe(migrationsAfter.length);
    for (let i = 0; i < migrationsBefore.length; i++) {
        expect(migrationsBefore[i]).toBe(migrationsAfter[i]);
    }
});
