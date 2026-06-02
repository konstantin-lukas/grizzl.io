import type { NuxtError } from "#app";
import type { useToast } from "#ui/composables";
import { h } from "vue";

export type ApiError = NuxtError<{
    message: string;
    statusCode: number;
    statusMessage: string;
}>;

export function createToastError(error: ApiError) {
    const isNuxtError = !!error.data;
    const message = (isNuxtError ? error.data?.message : error.message) ?? "";
    const rawTitle = isNuxtError ? error?.data?.statusMessage : error.name;
    const [description, id] = message.split(" | ");
    const title = id ? `${rawTitle} (ID: ${id})` : rawTitle;

    if (!isNuxtError)
        return {
            title,
            description,
            color: "error",
            close: {
                "data-test-id": "toast-close-button",
            } as never,
        } as const;

    return {
        title,
        description: h("div", {
            innerHTML: description,
            style: "white-space: preserve nowrap; text-overflow: ellipsis; overflow: hidden;",
        }),
        close: {
            "data-test-id": "toast-close-button",
        } as never,
        color: "error",
    } as const;
}

export function createToastSuccess(title: string, description?: string) {
    return {
        title,
        description,
        color: "success",
        close: {
            "data-test-id": "toast-close-button",
        } as never,
    } as const;
}

/* c8 ignore start */
export function onResponseError(toast: ReturnType<typeof useToast>, t: (key: string) => string) {
    return () => {
        toast.add({
            title: t("ui.toast.unableToFetchTitle"),
            description: t("ui.toast.unableToFetchDescription"),
            color: "error",
            close: {
                "data-test-id": "toast-close-button",
            } as never,
        });
    };
}
/* c8 ignore stop */
