import type { NuxtError } from "#app";

export type ApiError = NuxtError<{
    message: string;
    statusCode: number;
    statusMessage: string;
}>;
