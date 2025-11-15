export default function useUndoableAction({
    action,
    onSuccess,
    onError,
}: {
    action: () => Promise<void>;
    onSuccess?: () => void;
    onError?: () => void;
}) {
    const toast = useToast();
    const cancel = ref(false);
    const inProgress = ref(false);

    onBeforeUnmount(action);
    // UNLOAD EVENT

    function execute() {
        onSuccess?.();
        toast.add({
            "onUpdate:open": open => {
                setTimeout(() => {
                    if (open || cancel.value) {
                        cancel.value = false;
                        return;
                    }
                    action().catch(error => {
                        toast.add(createToastError(error));
                        onError?.();
                    });
                }, 0);
            },
            "actions": [
                {
                    label: "Undo",
                    icon: "heroicons:arrow-turn-down-left",
                    color: "neutral",
                    variant: "outline",
                    onClick: () => {
                        cancel.value = true;
                        inProgress.value = true;
                    },
                },
            ],
        });
        //setTimeout(() => action().then(onSuccess).catch(onError));
    }

    return { execute };
}
