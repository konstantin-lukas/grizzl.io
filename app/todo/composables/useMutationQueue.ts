import { type PostAction, TODO_MAX_ACTIONS, TODO_MIN_ACTIONS } from "#shared/todo/validators/action.validator";
import type { ApiError } from "~/core/utils/toast";

const MUTATION_QUEUE_TIMEOUT = 1000;

export default function useMutationQueue(watchChanges = false) {
    const queue = useState<PostAction[]>("todo-list-mutation-queue", () => []);
    const isFetching = useState<boolean>("todo-list-mutation-queue-is-fetching", () => false);
    const timeout = useState<NodeJS.Timeout | null>("todo-list-mutation-queue-timeout", () => null);
    const error = useState<ApiError | null>("todo-list-mutation-queue-error", () => null);

    if (watchChanges) {
        const mutate = () => {
            isFetching.value = true;
            const actions = queue.value.splice(0, TODO_MAX_ACTIONS);
            $fetch("/api/todo/actions", {
                method: "POST",
                body: actions,
            })
                .finally(() => (isFetching.value = false))
                .catch(e => {
                    error.value = e;
                });
        };

        watch(
            [queue, isFetching],
            () => {
                if (isFetching.value || queue.value.length < TODO_MIN_ACTIONS) return;
                if (queue.value.length >= TODO_MAX_ACTIONS) {
                    if (timeout.value) clearTimeout(timeout.value);
                    timeout.value = null;
                    mutate();
                    return;
                }
                if (timeout.value) clearTimeout(timeout.value);
                timeout.value = setTimeout(mutate, MUTATION_QUEUE_TIMEOUT);
            },
            { deep: true },
        );
    }
    return { queue, isFetching, error };
}
