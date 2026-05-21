import type { TodoList } from "~/todo/composables/useTodoLists";

export function useOpenList() {
    const openList = useState<TodoList | null>("open-todo-list", () => null);
    const id = useState<string>("open-todo-list-id", () => "");
    const title = useState<string>("open-todo-list-title", () => "");
    const completedItems = useState<TodoList["items"]["completed"]>("open-todo-list-completed-items", () => []);
    const uncompletedItems = useState<TodoList["items"]["completed"]>("open-todo-list-uncompleted-items", () => []);

    watch(
        () => openList.value?.id,
        () => {
            if (!openList.value || openList.value.id === id.value) return;
            const clone = structuredClone(toRaw(openList.value));
            id.value = clone.id;
            title.value = clone.title;
            completedItems.value = clone.items.completed.sort((left, right) => left.text.localeCompare(right.text));
            uncompletedItems.value = clone.items.uncompleted;
        },
        { immediate: true },
    );

    const sortCompletedItems = () => {
        completedItems.value.sort((left, right) => left.text.localeCompare(right.text));
    };

    const persistChanges = () => {
        if (!openList.value) return;
        openList.value.title = title.value;
        openList.value.items.completed = completedItems.value;
        openList.value.items.uncompleted = uncompletedItems.value;
    };

    return { openList, id, title, persistChanges, sortCompletedItems, completedItems, uncompletedItems };
}
