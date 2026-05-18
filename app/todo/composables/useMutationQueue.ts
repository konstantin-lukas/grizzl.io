import { useOpenList } from "~/todo/composables/useOpenList";

type MutationQueueItem = { action: "text"; id: string; value: string } | { action: "delete"; id: string };

export default function useMutationQueue() {
    const { openListCopy } = useOpenList();
    const queue = useState<MutationQueueItem[]>(`todo-list-mutation-queue-${openListCopy.value?.id}`, () => []);
    const isFetching = useState<boolean>(`todo-list-mutation-queue-${openListCopy.value?.id}-is-fetching`, () => false);

    watch(
        [queue, isFetching],
        () => {
            if (isFetching.value || queue.value.length === 0) return;
            isFetching.value = true;
            // Timeout to be replaced with API calls
            setTimeout(() => {
                queue.value.shift();
                isFetching.value = false;
            }, 1000);
        },
        { deep: true },
    );
    return { queue };
}
