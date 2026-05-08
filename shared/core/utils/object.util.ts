export function deepCopy<T extends object>(obj: T) {
    return JSON.parse(JSON.stringify(obj)) as T;
}

export function makeMap<K, V>(...args: readonly [K, V][]): ReadonlyMap<K, V> {
    return new Map<K, V>(args);
}
