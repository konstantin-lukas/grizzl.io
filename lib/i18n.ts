import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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

export function checkTranslationFileConsistency() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const translationDir = path.resolve(__dirname, "..", "i18n", "locales");

    const locales = fs.readdirSync(translationDir).filter(f => fs.statSync(path.join(translationDir, f)).isDirectory());

    const expectedFiles = fs
        .readdirSync(path.join(translationDir, locales[0]!))
        .filter(f => f.endsWith(".json"))
        .sort();

    for (const locale of locales) {
        const files = fs
            .readdirSync(path.join(translationDir, locale))
            .filter(f => f.endsWith(".json"))
            .sort();

        if (JSON.stringify(files) !== JSON.stringify(expectedFiles)) {
            throw new Error(`File mismatch in subdirectory "${locale}"`);
        }
    }

    for (const file of expectedFiles) {
        let expectedKeys: Set<string> | null = null;
        const hasMissingKeys = (keys: Set<string>, key: string) => !keys.has(key);
        const hasExtraKeys = (key: string) => !expectedKeys!.has(key);

        for (const locale of locales) {
            const filePath = path.join(translationDir, locale, file);
            const rawData = fs.readFileSync(filePath, "utf-8");
            const data = JSON.parse(rawData);

            const keys = collectKeys(data);
            if (!expectedKeys) {
                expectedKeys = keys;
            } else {
                const missingInCurrent = [...expectedKeys].filter(key => hasMissingKeys(keys, key));
                const extraInCurrent = [...keys].filter(key => hasExtraKeys(key));
                if (missingInCurrent.length || extraInCurrent.length) {
                    throw new Error(
                        `Key mismatch in file "${file}" in subdirectory "${locale}".\n` +
                            `Missing keys: ${missingInCurrent.join(", ")}\n` +
                            `Extra keys: ${extraInCurrent.join(", ")}`,
                    );
                }
            }
        }
    }
}

export function getTranslationFiles(locale: string) {
    const dirPath = path.join(process.cwd(), "i18n", "locales", locale);
    if (!fs.existsSync(dirPath)) {
        throw new Error(`Locale directory does not exist: ${dirPath}`);
    }

    const files = fs.readdirSync(dirPath);
    return files.filter(file => file.endsWith(".json")).map(file => path.join(locale, file));
}
