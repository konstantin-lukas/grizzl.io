<script setup lang="ts">
import type { TodoList } from "~/todo/composables/useTodoLists";
import { ICON_CANCEL, ICON_DRAG_VERTICAL } from "~/core/constants/icons.constant";
import Button from "~/core/components/button/Button.vue";
import { useOpenList } from "~/todo/composables/useOpenList";
import useDeferredValue from "~/core/composables/useDeferredValue";
import useMutationQueue from "~/todo/composables/useMutationQueue";
import DateButtonPicker from "~/todo/components/DateButtonPicker.vue";
import { deleteNthElement, insertElement } from "#shared/core/utils/array.util";
import AutoFocusInputMenu from "~/todo/components/AutoFocusInputMenu.vue";

type TodoItem = TodoList["items"]["completed" | "uncompleted"][number];
const props = defineProps<{
    item: TodoItem;
    type: "completed" | "uncompleted";
    index: number;
    skipFocus: boolean;
    listFullWarning?: string;
}>();
const emit = defineEmits<{
    (e: "break-item"): void;
    (e: "merge-items", index: number, caretPos: number): void;
}>();

const text = ref(props.item.text);
const menuOpen = ref(false);
const scheduledFor = shallowRef(null);
const el = ref(null);
const isVisible = ref(false);
const checked = ref(props.type === "completed");
let observer: IntersectionObserver;

const deferredText = useDeferredValue(text);
const { queue } = useMutationQueue();
const { completedItems, id, uncompletedItems, sortCompletedItems, generateNewID } = useOpenList();

const autoCompleteSuggestions = computed(() => completedItems.value.map(({ text }) => text));
const bottomID = computed(() => `bottom-${props.item.id}`);

const deleteSelf = () => {
    queue.value.push({ action: "delete", id: props.item.id, listId: id.value });

    if (props.type === "completed") {
        completedItems.value = deleteNthElement(completedItems.value, props.index);
        return;
    }

    uncompletedItems.value = deleteNthElement(uncompletedItems.value, props.index);
    return;
};

const updateText = (value: string) => {
    queueMicrotask(() => {
        menuOpen.value = document.getElementById(bottomID.value ?? "")?.checkVisibility() ?? false;
    });

    const duplicateIndex = completedItems.value.findIndex(({ text }) => text === value);
    if (duplicateIndex > -1) {
        queue.value.push({ action: "delete", id: completedItems.value[duplicateIndex]!.id, listId: id.value });
        completedItems.value = deleteNthElement(completedItems.value, duplicateIndex);
    }

    (props.type === "completed" ? completedItems : uncompletedItems).value[props.index]!.text = value;
    queue.value.push({ action: "text", id: props.item.id, value, listId: id.value });
};

const handleKeydown = (e: KeyboardEvent) => {
    if (props.type === "completed") return;
    const input = e.target;

    if (!(input instanceof HTMLInputElement)) return;

    const { value } = input;

    const beforeCaret = value.slice(0, input.selectionStart ?? value.length);
    const afterCaret = value.slice(input.selectionEnd ?? value.length);

    if (e.key === "Backspace") {
        if (input.selectionStart === 0) {
            e.preventDefault();
            if (props.index === 0) return;
            const targetItem = uncompletedItems.value[props.index - 1]!;
            const targetCaretPos = targetItem.text.length;
            targetItem.text += afterCaret;
            queue.value.push({ action: "text", listId: id.value, id: targetItem.id, value: targetItem.text });
            queue.value.push({ action: "delete", listId: id.value, id: props.item.id });
            uncompletedItems.value = deleteNthElement(uncompletedItems.value, props.index);
            emit("merge-items", props.index - 1, targetCaretPos);
        }
    } else if (e.key === "Enter" && !menuOpen.value) {
        e.preventDefault();
        emit("break-item");
        if (props.listFullWarning) {
            alert(props.listFullWarning);
            return;
        }
        const newItem = { text: afterCaret, scheduledFor: null, id: generateNewID() };
        const newIndex = props.index + 1;
        queue.value.push({
            action: "create",
            listId: id.value,
            id: newItem.id,
            text: afterCaret,
            index: newIndex,
        });
        uncompletedItems.value = insertElement(uncompletedItems.value, newItem, newIndex);
        updateText(beforeCaret);
    }
};

watch(text, updateText);

watch(scheduledFor, value => {
    if (!props) return;
    (props.type === "completed" ? completedItems : uncompletedItems).value[props.index]!.scheduledFor = value;
    queue.value.push({ action: "schedule", id: props.item.id, value, listId: id.value });
});

watch(checked, value => {
    const { index, item } = props;

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

const handleUpdate = (value: string) => {
    queueMicrotask(() => {
        menuOpen.value = document.getElementById(bottomID.value ?? "")?.checkVisibility() ?? false;
        if (menuOpen.value) text.value = value;
        else deferredText.value = value;
    });
};

onMounted(() => {
    observer = new IntersectionObserver(
        ([entry]) => {
            if (!entry) return;
            isVisible.value = entry.isIntersecting;
        },
        {
            threshold: 0,
        },
    );

    if (el.value) observer.observe(el.value);
});

onBeforeUnmount(() => {
    if (observer && el.value) observer.unobserve(el.value);
});
</script>

<template>
    <li ref="el" class="box-border h-10.5 border-y border-y-transparent py-1 focus-within:border-y-muted">
        <Transition name="fade">
            <div v-if="isVisible" class="flex items-center gap-1" :class="{ 'ml-6.5': checked }">
                <div v-if="!checked" class="center cursor-move" data-handle>
                    <UIcon :name="ICON_DRAG_VERTICAL" class="size-5.5 text-muted hover-none:size-6.5" />
                </div>
                <UCheckbox v-model="checked" :aria-label="props.item.text" />
                <AutoFocusInputMenu
                    v-if="props.type === 'uncompleted'"
                    :aria-label="$t('todo.aria.itemText')"
                    :model-value="props.item.text"
                    mode="autocomplete"
                    :items="autoCompleteSuggestions"
                    :trailing-icon="false"
                    :content="{ hideWhenEmpty: true }"
                    class="grow"
                    variant="none"
                    :skip-focus="props.skipFocus"
                    data-task-text-input
                    @update:model-value="handleUpdate"
                    @keydown="handleKeydown"
                >
                    <template #content-bottom>
                        <span :id="bottomID" />
                    </template>
                </AutoFocusInputMenu>
                <div v-else class="grow overflow-hidden px-3 text-sm text-ellipsis text-muted line-through">
                    {{ props.item.text }}
                </div>
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
        </Transition>
    </li>
</template>
