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

export function createToastSuccess(message: string) {
    return {
        title: "Success",
        description: message,
        color: "success",
    } as const;
}
