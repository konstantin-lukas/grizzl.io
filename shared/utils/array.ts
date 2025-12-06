export function duplicateNthElement<T>(array: T[], n: number) {
    if (n < 0 || n >= array.length) return [...array];
    return [...array.slice(0, n + 1), array[n]!, ...array.slice(n + 1)];
}

export function deleteNthElement<T>(array: T[], n: number) {
    if (n < 0 || n >= array.length) return [...array];
    return [...array.slice(0, n), ...array.slice(n + 1)];
}

export function moveElement<T>(array: T[], fromIndex: number, toIndex: number): T[] {
    const result = [...array];

    if (fromIndex < 0 || fromIndex >= array.length || toIndex < 0 || toIndex >= array.length) {
        return result;
    }

    const [element] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, element!);

    return result;
}
