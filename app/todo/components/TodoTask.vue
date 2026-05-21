<script setup lang="ts">
import type { TodoList } from "~/todo/composables/useTodoLists";
import { ICON_CANCEL, ICON_DRAG_VERTICAL } from "~/core/constants/icons.constant";
import Button from "~/core/components/button/Button.vue";
import { useOpenList } from "~/todo/composables/useOpenList";
import useDeferredValue from "~/core/composables/useDeferredValue";
import useMutationQueue from "~/todo/composables/useMutationQueue";
import DateButtonPicker from "~/todo/components/DateButtonPicker.vue";
import { deleteNthElement, insertElement } from "#shared/core/utils/array.util";
import { nanoid } from "#shared/core/utils/id.util";

type TodoItem = TodoList["items"]["completed" | "uncompleted"][number];
const { completedItems, id, uncompletedItems, sortCompletedItems } = useOpenList();
const props = defineProps<{ item: TodoItem }>();

const text = ref(props.item.text);
const menuOpen = ref(false);
const scheduledFor = shallowRef(null);

const deferredText = useDeferredValue(text);
const { queue } = useMutationQueue();

const existingIDs = computed(() => {
    const completedIDs = completedItems.value.map(({ id }) => id);
    const uncompletedIDs = uncompletedItems.value.map(({ id }) => id);
    return new Set<string>([...completedIDs, ...uncompletedIDs]);
});

const self = computed(() => {
    const findItem = (item: TodoItem) => item.id === props.item.id;
    let index = uncompletedItems.value.findIndex(findItem);
    if (index > -1) return { index, type: "uncompleted", item: uncompletedItems.value[index]! } as const;
    index = completedItems.value.findIndex(findItem);
    if (index > -1) return { index, type: "completed", item: completedItems.value[index]! } as const;
    return null;
});

const autoCompleteSuggestions = computed(() => completedItems.value.map(({ text }) => text));

const checked = ref(self.value?.type === "completed");

const deleteSelf = () => {
    if (!self.value) return;
    queue.value.push({ action: "delete", id: props.item.id, listId: id.value });

    if (self.value.type === "completed") {
        completedItems.value = deleteNthElement(completedItems.value, self.value.index);
        return;
    }

    uncompletedItems.value = deleteNthElement(uncompletedItems.value, self.value.index);
    return;
};

const generateNewID = () => {
    while (true) {
        const id = nanoid();
        if (!existingIDs.value.has(id)) return id;
    }
};

const handleKeydown = (e: KeyboardEvent) => {
    if (!self.value) return;

    const input = e.target;

    if (!(input instanceof HTMLInputElement)) return;

    const completedIsRelevant = self.value.type === "completed";
    const relevantList = completedIsRelevant ? completedItems : uncompletedItems;

    const { value } = input;

    const beforeCaret = value.slice(0, input.selectionStart ?? value.length);
    const afterCaret = value.slice(input.selectionEnd ?? value.length);

    if (e.key === "Backspace") {
        if (input.selectionStart === 0) {
            if (self.value.index === 0) return;
            const targetItem = relevantList.value[self.value.index - 1]!;
            targetItem.text += afterCaret;
            queue.value.push({ action: "text", listId: id.value, id: targetItem.id, value: targetItem.text });
            queue.value.push({ action: "delete", listId: id.value, id: self.value.item.id });
            relevantList.value = deleteNthElement(relevantList.value, self.value.index);
        }
    } else if (e.key === "Enter" && !menuOpen.value) {
        const newItem = { text: afterCaret, scheduledFor: null, id: generateNewID() };
        const newIndex = self.value.index + 1;
        queue.value.push({
            action: "create",
            listId: id.value,
            id: newItem.id,
            text: afterCaret,
            index: completedIsRelevant ? null : newIndex,
        });
        relevantList.value = insertElement(relevantList.value, newItem, newIndex);
        if (completedIsRelevant) sortCompletedItems();

        text.value = beforeCaret;
    }
};

watch(text, value => {
    if (!self.value) return;

    const duplicateIndex = completedItems.value.findIndex(({ text }) => text === value);
    if (duplicateIndex > -1) {
        queue.value.push({ action: "delete", id: completedItems.value[duplicateIndex]!.id, listId: id.value });
        completedItems.value = deleteNthElement(completedItems.value, duplicateIndex);
    }

    self.value.item.text = value;
    queue.value.push({ action: "text", id: self.value.item.id, value, listId: id.value });
});

watch(scheduledFor, value => {
    if (!self.value) return;
    self.value.item.scheduledFor = value;
    queue.value.push({ action: "schedule", id: self.value.item.id, value, listId: id.value });
});

watch(checked, value => {
    if (!self.value) return;

    const { index, item } = self.value;

    if (value) {
        if (completedItems.value.every(({ text }) => text !== item.text)) {
            completedItems.value.push(item);
            queue.value.push({ action: "check", id: item.id, listId: id.value });
            sortCompletedItems();
        } else {
            queue.value.push({ action: "delete", id: item.id, listId: id.value });
        }
        uncompletedItems.value = deleteNthElement(uncompletedItems.value, index);
    } else {
        uncompletedItems.value.push({ ...item, scheduledFor: null });
        completedItems.value = deleteNthElement(completedItems.value, index);
        queue.value.push({ action: "uncheck", id: item.id, listId: id.value });
    }
});
</script>

<template>
    <li class="group box-border border-y border-y-transparent py-1 focus-within:border-y-muted">
        <div class="flex items-center gap-1" :class="{ 'ml-6.5': checked }">
            <div v-if="!checked" class="center cursor-move" data-handle>
                <UIcon :name="ICON_DRAG_VERTICAL" class="size-5.5 text-muted hover-none:size-6.5" />
            </div>
            <UCheckbox v-model="checked" :aria-label="props.item.text" />
            <UInputMenu
                v-if="self?.type === 'uncompleted'"
                :aria-label="$t('todo.aria.itemText')"
                :model-value="props.item.text"
                autocomplete
                :items="autoCompleteSuggestions"
                :trailing-icon="false"
                :content="{ hideWhenEmpty: true }"
                class="grow"
                variant="none"
                @update:open="value => (menuOpen = value)"
                @update:model-value="value => (deferredText = value)"
                @keydown="handleKeydown"
            />
            <UInput
                v-else
                :aria-label="$t('todo.aria.itemText')"
                :model-value="props.item.text"
                :items="autoCompleteSuggestions"
                :trailing-icon="false"
                :content="{ hideWhenEmpty: true }"
                class="grow"
                variant="none"
                @update:model-value="value => (deferredText = value)"
                @keydown="handleKeydown"
            />
            <div class="flex hover-none:gap-1">
                <DateButtonPicker v-if="!checked" v-model="scheduledFor" />
                <Button
                    :icon="ICON_CANCEL"
                    variant="ghost"
                    color="neutral"
                    class="center size-7 text-muted hover-none:size-8"
                    :aria-label="$t('todo.aria.deleteTask')"
                    @click="deleteSelf"
                />
            </div>
        </div>
    </li>
</template>
