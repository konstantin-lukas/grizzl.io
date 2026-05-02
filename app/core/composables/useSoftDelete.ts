import { useToast } from "#ui/composables";
import { ICON_RETURN } from "~/core/constants/icons.constant";
import { createToastError } from "~/core/utils/toast";

export default function useSoftDelete(
    resource: Ref<string>,
    options?: {
        refresh?: () => Promise<void>;
        successTitle?: string;
        successDescription?: string;
        interpolations?: Ref<Record<string, string>>;
    },
) {
    const toast = useToast();
    const { start, finish } = useLoadingIndicator();
    const { t } = useI18n();
    async function execute() {
        const route = resource.value;
        const interpolations = { ...options?.interpolations?.value };
        await $fetch(route, { method: "PATCH", body: { deleted: true } })
            .then(() => {
                toast.add({
                    title: options?.successTitle && t(options.successTitle),
                    description: options?.successDescription && t(options.successDescription, interpolations),
                    orientation: "vertical",
                    color: "success",
                    close: {
                        "data-test-id": "toast-close-button",
                    } as never,
                    actions: [
                        {
                            ...{ "data-test-id": "undo-soft-delete-button" },
                            label: t("ui.undo"),
                            icon: ICON_RETURN,
                            color: "neutral",
                            variant: "outline",
                            onClick: () => {
                                start();
                                $fetch(route, { method: "PATCH", body: { deleted: false } })
                                    .catch(error => toast.add(createToastError(error)))
                                    .finally(async () => {
                                        await options?.refresh?.();
                                        finish();
                                    });
                            },
                        },
                    ],
                });
            })
            .catch(error => {
                toast.add(createToastError(error));
            })
            .finally(() => {
                options?.refresh?.();
            });
    }

    return execute;
}
