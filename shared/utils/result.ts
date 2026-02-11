import type { Failure, Result, Success } from "#shared/types/result";

export async function tryCatch<T, E extends Error>(promise: Promise<T>): Promise<Result<T, E>> {
    try {
        const data = await promise;
        return { data, error: null };
    } catch (error) {
        return { data: null, error: error as E };
    }
}

export function tryCatchSync<T, E extends Error>(fn: () => T): Result<T, E> {
    try {
        const data = fn();
        return { data, error: null };
    } catch (error) {
        return { data: null, error: error as E };
    }
}

export function ok<T>(data?: T) {
    return { data, error: null } as Success<T>;
}

export function err<E extends Error>(error: E) {
    return { data: null, error } as Failure<E>;
}
