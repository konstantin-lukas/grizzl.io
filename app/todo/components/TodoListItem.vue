<script setup lang="ts">
import type { TodoList } from "~/todo/composables/useTodoLists";
import { ICON_CANCEL, ICON_DRAG_VERTICAL } from "~/core/constants/icons.constant";
import Button from "~/core/components/button/Button.vue";
import { useOpenList } from "~/todo/composables/useOpenList";
import useDeferredValue from "~/core/composables/useDeferredValue";
import useMutationQueue from "~/todo/composables/useMutationQueue";
import DateButtonPicker from "~/todo/components/DateButtonPicker.vue";
import { deleteNthElement } from "#shared/core/utils/array.util";

type TodoItem = TodoList["items"]["completed" | "uncompleted"][number];
const { openListCopy } = useOpenList();
const props = defineProps<{ item: TodoItem }>();

const text = ref(props.item.text);
const scheduledFor = shallowRef(null);

const deferredText = useDeferredValue(text);
const { queue } = useMutationQueue();

const self = computed(() => {
    if (!openListCopy.value) return null;
    const findItem = (item: TodoItem) => item.id === props.item.id;
    let index = openListCopy.value.items.uncompleted.findIndex(findItem);
    if (index > -1) return { index, type: "uncompleted", item: openListCopy.value.items.uncompleted[index]! } as const;
    index = openListCopy.value.items.completed.findIndex(findItem);
    if (index > -1) return { index, type: "completed", item: openListCopy.value.items.completed[index]! } as const;
    return null;
});

const checked = ref(() => self.value?.type === "completed");

const deleteSelf = () => {
    if (!openListCopy.value || !self.value) return;
    queue.value.push({ action: "delete", id: props.item.id, listId: openListCopy.value.id });

    openListCopy.value.items[self.value.type] = deleteNthElement(
        openListCopy.value.items[self.value.type],
        self.value.index,
    );
};

watch(text, value => {
    if (!openListCopy.value || !self.value) return;
    self.value.item.text = value;
    queue.value.push({ action: "text", id: self.value.item.id, value, listId: openListCopy.value.id });
});

watch(scheduledFor, value => {
    if (!openListCopy.value || !self.value) return;
    self.value.item.scheduledFor = value;
    queue.value.push({ action: "schedule", id: self.value.item.id, value, listId: openListCopy.value.id });
});
</script>

<template>
    <li class="group box-border border-y border-y-transparent py-1 focus-within:border-y-muted">
        <div class="flex items-center gap-1">
            <div class="center cursor-move" data-handle>
                <UIcon :name="ICON_DRAG_VERTICAL" class="size-5.5 text-muted hover-none:size-6.5" />
            </div>
            <UCheckbox v-model="checked" />
            <UInput
                :model-value="props.item.text"
                class="grow"
                variant="none"
                @update:model-value="value => (deferredText = value)"
            />
            <div class="flex hover-none:gap-1">
                <DateButtonPicker v-model="scheduledFor" />
                <Button
                    :icon="ICON_CANCEL"
                    variant="ghost"
                    color="neutral"
                    class="center size-7 text-muted hover-none:size-8"
                    @click="deleteSelf"
                />
            </div>
        </div>
    </li>
</template>
