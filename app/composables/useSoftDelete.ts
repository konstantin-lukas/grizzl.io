export default function useSoftDelete(
    resource: string,
    options?: {
        refresh?: () => Promise<void>;
        successTitle?: string;
        successDescription?: string;
        interpolations?: Record<string, string>;
    },
) {
    const toast = useToast();
    const { start, finish } = useLoadingIndicator();
    const { t } = useI18n();
    async function execute() {
        await $fetch(resource, { method: "PATCH", body: { deleted: true } })
            .then(() => {
                toast.add({
                    title: options?.successTitle && t(options.successTitle),
                    description:
                        options?.successDescription && t(options.successDescription, options.interpolations ?? {}),
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
                                $fetch(resource, { method: "PATCH", body: { deleted: false } })
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
