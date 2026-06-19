export function ellipsize(text: string, max: number) {
    if (text.length <= max) return text;
    return `${text.slice(0, max)}…`;
}

export function normalize(str: string) {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .replaceAll(/\s+/g, "_");
}
