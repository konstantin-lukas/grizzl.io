import type { PostAction } from "#shared/todo/validators/action.validator";

export default function useMutationQueue(watchChanges = false) {
    const queue = useState<PostAction[]>("todo-list-mutation-queue", () => []);
    const isFetching = useState<boolean>("todo-list-mutation-queue-is-fetching", () => false);

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
