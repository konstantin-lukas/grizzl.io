import { h } from "vue";
import type { ApiError } from "~/types/error";

export function createToastError(error: ApiError) {
    if (!error.data) {
        return {
            title: error.name,
            description: error.message,
            color: "error",
        } as const;
    }
    return {
        title: error?.data?.statusMessage,
        description: h("div", {
            innerHTML: error?.data?.message,
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
