import type { TodoList } from "~/todo/composables/useTodoLists";

export function useOpenList() {
    const openList = useState<TodoList | null>("open-todo-list", () => null);
    const id = useState<string>("open-todo-list-id", () => "");
    const title = useState<string>("open-todo-list-title", () => "");
    const completedItems = useState<TodoList["items"]["completed"]>("open-todo-list-completed-items", () => []);
    const uncompletedItems = useState<TodoList["items"]["completed"]>("open-todo-list-uncompleted-items", () => []);

    watch(
        openList,
        () => {
            if (!openList.value) return;
            const clone = structuredClone(toRaw(openList.value));
            title.value = clone.title;
            completedItems.value = clone.items.completed;
            uncompletedItems.value = clone.items.uncompleted;
        },
        { immediate: true },
    );

    return { openList, id, title, completedItems, uncompletedItems };
}
