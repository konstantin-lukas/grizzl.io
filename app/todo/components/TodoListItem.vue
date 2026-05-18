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
const { completedItems, id, uncompletedItems } = useOpenList();
const props = defineProps<{ item: TodoItem }>();

const text = ref(props.item.text);
const scheduledFor = shallowRef(null);

const deferredText = useDeferredValue(text);
const { queue } = useMutationQueue();

const self = computed(() => {
    const findItem = (item: TodoItem) => item.id === props.item.id;
    let index = uncompletedItems.value.findIndex(findItem);
    if (index > -1) return { index, type: "uncompleted", item: uncompletedItems.value[index]! } as const;
    index = completedItems.value.findIndex(findItem);
    if (index > -1) return { index, type: "completed", item: completedItems.value[index]! } as const;
    return null;
});

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

watch(text, value => {
    if (!self.value) return;
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

    const { index } = self.value;

    if (value) {
        completedItems.value.unshift(self.value.item);
        uncompletedItems.value = deleteNthElement(uncompletedItems.value, index);
    } else {
        uncompletedItems.value.push(self.value.item);
        completedItems.value = deleteNthElement(completedItems.value, index);
    }
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
