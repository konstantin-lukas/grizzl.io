export default function useSoftDelete(resource: string, refresh?: () => Promise<void>) {
    const toast = useToast();
    const { start, finish } = useLoadingIndicator();
    async function execute() {
        await $fetch(resource, { method: "PATCH", body: { deleted: true } })
            .then(() => {
                toast.add({
                    title: "Successfully deleted",
                    orientation: "horizontal",
                    color: "success",
                    actions: [
                        {
                            label: "Undo",
                            icon: "heroicons:arrow-turn-down-left",
                            color: "neutral",
                            variant: "outline",
                            onClick: () => {
                                start();
                                $fetch(resource, { method: "PATCH", body: { deleted: false } })
                                    .catch(error => toast.add(createToastError(error)))
                                    .finally(async () => {
                                        await refresh?.();
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
                refresh?.();
            });
    }

    return execute;
}
