import { h } from "vue";
import type { ApiError } from "~/types/error";

export function createToastError(error: ApiError) {
    const isNuxtError = !!error.data;
    const message = (isNuxtError ? error.data?.message : error.message) ?? "";
    const rawTitle = isNuxtError ? error?.data?.statusMessage : error.name;
    const [description, id] = message.split(" | ");
    const title = id ? `${rawTitle} (ID: ${id})` : rawTitle;

    if (!isNuxtError) return { title, description, color: "error" } as const;

    return {
        title,
        description: h("div", {
            innerHTML: description,
            style: "white-space: preserve nowrap; text-overflow: ellipsis; overflow: hidden;",
        }),
        color: "error",
    } as const;
}

export function createToastSuccess(title: string, description?: string) {
    return {
        title,
        description,
        color: "success",
    } as const;
}
