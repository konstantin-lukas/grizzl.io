import { tryCatch } from "#shared/utils/result";
import type { ApiError } from "~/types/error";

export async function tryCatchApi<T>(promise: Promise<T>) {
    return tryCatch<T, ApiError>(promise);
}
