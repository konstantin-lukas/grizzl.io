import fs from "node:fs";
import path from "node:path";

function getTranslationFiles(locale: string) {
    const dirPath = path.join(process.cwd(), "i18n", "locales", locale);
    if (!fs.existsSync(dirPath)) {
        throw new Error(`Locale directory does not exist: ${dirPath}`);
    }

    const files = fs.readdirSync(dirPath);
    return files.filter(file => file.endsWith(".json")).map(file => path.join(locale, file));
}

const languages = ["en-US", "de-DE", "es-ES", "ja-JP"] as const;
type LanguageCode = (typeof languages)[number] extends `${infer T}-${string}` ? T : never;

const LOCALES = ["en-US", "de-DE", "es-ES", "ja-JP"].map(locale => ({
    code: locale.split("-")[0],
    language: locale,
    files: getTranslationFiles(locale),
})) as {
    code: LanguageCode;
    language: (typeof languages)[number];
    files: string[];
}[];

export default LOCALES;
