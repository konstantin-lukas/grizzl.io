export function removeWhitespace(str: string) {
    return str.replace(/\s/g, "");
}

export function capitalize(str: string) {
    return String(str).charAt(0).toUpperCase() + String(str).slice(1);
}
