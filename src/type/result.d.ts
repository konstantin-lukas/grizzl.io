interface Success<T> {
    data: T;
    error: null;
}

interface Failure<E> {
    data: null;
    error: E;
}

export type Result<T, E = Error> = Success<T> | Failure<E>;

export type ActionResult<T> = Promise<Success<T> | Failure<string[]>>;

export type ActionStateResult<T> = (Success<T> | Failure<string[]>) & {
    action: () => void;
    pending: boolean;
};
