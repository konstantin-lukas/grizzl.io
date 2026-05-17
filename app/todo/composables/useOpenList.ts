import type { TodoList } from "~/todo/composables/useTodoLists";

export function useOpenList() {
    const openList = useState<TodoList | null>("open-todo-list", () => null);

    return { openList };
}
