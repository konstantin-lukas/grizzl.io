import { useOpenList } from "~/todo/composables/useOpenList";

type MutationQueueItem =
    | { action: "text"; id: string; value: string; listId: string }
    | { action: "delete"; id: string; listId: string }
    | { action: "schedule"; id: string; value: Date | null; listId: string }
    | { action: "move"; id: string; from: number; to: number; listId: string }
    | { action: "uncheck" | "check"; id: string; listId: string }
    | { action: "create"; id: string; listId: string; text: string; index: number | null };

export default function useMutationQueue(watchChanges = false) {
    const { id } = useOpenList();
    const queue = useState<MutationQueueItem[]>(`todo-list-mutation-queue-${id.value}`, () => []);
    const isFetching = useState<boolean>(`todo-list-mutation-queue-${id.value}-is-fetching`, () => false);

    if (watchChanges) {
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
    }
    return { queue };
}
