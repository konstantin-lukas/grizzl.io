import { useToast } from "#ui/composables";
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
                    actions: [
                        {
                            ...{ "data-test-id": "undo-soft-delete-button" },
                            label: t("ui.undo"),
                            icon: "heroicons:arrow-turn-down-left",
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
