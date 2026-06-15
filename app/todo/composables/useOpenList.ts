import { nanoid } from "#shared/core/utils/id.util";
import type { TodoItem, TodoList } from "~/todo/composables/useTodoLists";

type Preset = FetchReturnValue<"/api/todo/lists/:listId/presets">[number];

export function useOpenList(watchChanges = false) {
    const openList = useState<TodoList | null>("open-todo-list", () => null);
    const presets = useState<Preset[]>("open-todo-list-presets", () => []);
    const id = useState<string>("open-todo-list-id", () => "");
    const title = useState<string>("open-todo-list-title", () => "");
    const completedItems = useState<TodoItem[]>("open-todo-list-completed-items", () => []);
    const uncompletedItems = useState<TodoItem[]>("open-todo-list-uncompleted-items", () => []);
    const existingIDs = useState<Set<string>>("open-todo-list-existing-ids", () => new Set());

    const refreshPresets = () => {
        $fetch(`/api/todo/lists/${id.value}/presets`).then(response => (presets.value = response));
    };

    const refreshOpenList = () => {
        if (!openList.value) return;
        const clone = structuredClone(toRaw(openList.value));
        id.value = clone.id;
        title.value = clone.title;
        completedItems.value = clone.items.completed.sort((left, right) => left.text.localeCompare(right.text));
        uncompletedItems.value = clone.items.uncompleted;
        refreshPresets();
    };

    if (watchChanges) {
        watch(() => openList.value?.id, refreshOpenList, { immediate: true });

        watchEffect(() => {
            const completedIDs = completedItems.value.map(({ id }) => id);
            const uncompletedIDs = uncompletedItems.value.map(({ id }) => id);
            existingIDs.value = new Set<string>([...completedIDs, ...uncompletedIDs]);
        });
    }

    const generateNewID = () => {
        while (true) {
            const id = nanoid();
            if (!existingIDs.value.has(id)) return id;
        }
    };

    const sortCompletedItems = () => {
        completedItems.value.sort((left, right) => left.text.localeCompare(right.text));
    };

    const persistChanges = () => {
        if (!openList.value) return;
        openList.value.title = title.value;
        openList.value.items.completed = completedItems.value;
        openList.value.items.uncompleted = uncompletedItems.value;
    };

    return {
        openList,
        id,
        title,
        persistChanges,
        sortCompletedItems,
        generateNewID,
        existingIDs,
        completedItems,
        uncompletedItems,
        refreshOpenList,
        presets,
        refreshPresets,
    };
}
