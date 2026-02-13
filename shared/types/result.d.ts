interface Success<T> {
    data: T;
    error: null;
}

interface Failure<E> {
    data: null;
    error: E;
}

export type Result<T, E = Error> = Success<T> | Failure<E>;
