import { useToast } from "#ui/composables";
import useOnSubmit from "~/core/composables/useOnSubmit";
import { onResponseError } from "~/core/utils/toast";

export type TodoList = ReturnType<typeof useFetch<void, unknown, "/api/todo/lists">>["data"]["value"][number];

export default function useTodoLists() {
    const toast = useToast();
    const { t } = useI18n();

    const { data, refresh } = useFetch("/api/todo/lists", {
        onResponseError: onResponseError(toast, t),
    });

    const createTodoList = useOnSubmit({
        url: () => "/api/todo/lists",
        method: () => "POST",
        state: {
            icon: "question-mark-rounded",
        },
        transform: ({ ...state }) => ({ ...state, title: t("todo.newList") }),
        translationKey: "todo",
        refresh,
    });

    return { todoLists: data, refreshTodoLists: refresh, createTodoList };
}
