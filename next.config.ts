import { version } from "@/package.json";
import fs from "fs";
import type { NextConfig } from "next";
import path from "path";

import { tryCatchSync } from "@util/misc";

function collectKeys(obj: Record<string, never>, prefix = ""): Set<string> {
    const keys = new Set<string>();

    for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        keys.add(fullKey);

        if (value && typeof value === "object" && !Array.isArray(value)) {
            for (const nestedKey of collectKeys(value, fullKey)) {
                keys.add(nestedKey);
            }
        }
    }

    return keys;
}

/**
 * Check JSON consistency across subdirectories of `rootDir`.
 * - Each subdirectory must contain the same JSON files.
 * - Each JSON file with the same name must have identical keys (nested included).
 * @returns true if all checks pass, false otherwise.
 */
export function checkTranslationFileConsistency(): boolean {
    const translationDir = new URL("./src/dictionary", import.meta.url).pathname;
    const locales = fs.readdirSync(translationDir).filter(f => fs.statSync(path.join(translationDir, f)).isDirectory());

    const expectedFiles = fs
        .readdirSync(path.join(translationDir, locales[0]))
        .filter(f => f.endsWith(".json"))
        .sort();

    for (const locale of locales) {
        const files = fs
            .readdirSync(path.join(translationDir, locale))
            .filter(f => f.endsWith(".json"))
            .sort();

        if (JSON.stringify(files) !== JSON.stringify(expectedFiles)) {
            console.error(`File mismatch in subdirectory "${locale}"`);
            return false;
        }
    }

    for (const file of expectedFiles) {
        let expectedKeys: Set<string> | null = null;
        const hasMissingKeys = (keys: Set<string>, key: string) => !keys.has(key);
        const hasExtraKeys = (key: string) => !expectedKeys!.has(key);

        for (const locale of locales) {
            const filePath = path.join(translationDir, locale, file);
            const rawData = fs.readFileSync(filePath, "utf-8");
            const { data, error } = tryCatchSync(() => JSON.parse(rawData));
            if (error) {
                console.error(`Invalid JSON in file "${filePath}"`);
                return false;
            }

            const keys = collectKeys(data);

            if (!expectedKeys) {
                expectedKeys = keys;
            } else {
                const missingInCurrent = [...expectedKeys].filter(key => hasMissingKeys(keys, key));
                const extraInCurrent = [...keys].filter(key => hasExtraKeys(key));

                if (missingInCurrent.length || extraInCurrent.length) {
                    console.error(
                        `Key mismatch in file "${file}" in subdirectory "${locale}".\n` +
                            `Missing keys: ${missingInCurrent.join(", ")}\n` +
                            `Extra keys: ${extraInCurrent.join(", ")}`,
                    );
                    return false;
                }
            }
        }
    }

    return true;
}

if (!checkTranslationFileConsistency()) {
    throw new Error("Translation file consistency check failed. Stopping build.");
}

const nextConfig: NextConfig = {
    output: "standalone",
    compiler: {
        reactRemoveProperties: process.env.APP_ENV === "production",
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    publicRuntimeConfig: {
        version,
    },
    allowedDevOrigins: ["grizzl.localhost", "*.grizzl.localhost"],
};

export default nextConfig;
