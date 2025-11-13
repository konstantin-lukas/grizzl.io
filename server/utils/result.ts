export async function tryThrow<T, E extends Error>(promise: Promise<T>): Promise<T> {
    const { data, error } = await tryCatch<T, E>(promise);
    if (error) throwError(error, "UNPROCESSABLE_CONTENT", true);
    return data!;
}
