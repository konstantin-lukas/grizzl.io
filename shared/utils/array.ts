export function duplicateNthElement<T>(array: T[], n: number) {
    return [...array.slice(0, n + 1), array[n]!, ...array.slice(n + 1)];
}

export function deleteNthElement<T>(array: T[], n: number) {
    return [...array.slice(0, n), ...array.slice(n + 1)];
}
