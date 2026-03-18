export function removeWhitespace(str: string) {
    return str.replace(/\s/g, "");
}

export function capitalize(str: string) {
    return String(str).charAt(0).toUpperCase() + String(str).slice(1);
}

export function JSONWithBigInt(data: object) {
    const marker = "__bigint__:";

    return JSON.stringify(data, (_, value) => (typeof value === "bigint" ? marker + value.toString() : value)).replace(
        new RegExp(`"${marker}(-?\\d+)"`, "g"),
        "$1",
    );
}
