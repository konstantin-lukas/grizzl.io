export function defaultIfUndefined<T1, T2>(value: T1, def: () => T2) {
    return value === undefined ? def() : value;
}
