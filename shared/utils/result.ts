import type { Result } from "#shared/types/result";

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
