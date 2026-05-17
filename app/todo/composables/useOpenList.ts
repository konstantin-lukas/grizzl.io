import type { TodoList } from "~/todo/composables/useTodoLists";

export function useOpenList() {
    const openList = useState<TodoList | null>("open-todo-list", () => null);
    const openListCopy = useState<TodoList | null>("open-todo-list-copy", () => null);

    watchEffect(() => {
        if (!openList.value) return;
        openListCopy.value = structuredClone(toRaw(openList.value));
    });

    return { openList, openListCopy };
}
