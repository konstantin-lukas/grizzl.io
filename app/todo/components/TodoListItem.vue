<script setup lang="ts">
import type { TodoList } from "~/todo/composables/useTodoLists";
import { ICON_CANCEL, ICON_DRAG_VERTICAL } from "~/core/constants/icons.constant";
import Button from "~/core/components/button/Button.vue";
import { useOpenList } from "~/todo/composables/useOpenList";
import useDeferredValue from "~/core/composables/useDeferredValue";
import useMutationQueue from "~/todo/composables/useMutationQueue";
import DateButtonPicker from "~/todo/components/DateButtonPicker.vue";

type TodoItem = TodoList["items"]["completed" | "uncompleted"][number];
const { openListCopy } = useOpenList();
const props = defineProps<{ item: TodoItem }>();

const textModel = ref(props.item.text);
const deferredText = useDeferredValue(textModel);
const { queue } = useMutationQueue();

watch(textModel, value => {
    const findItem = (item: TodoItem) => item.id === props.item.id;
    const targetItem =
        openListCopy.value?.items.uncompleted.find(findItem) || openListCopy.value?.items.completed.find(findItem);
    if (!targetItem) return;
    targetItem.text = value;
    queue.value.push({ action: "text", id: targetItem.id, value });
});
</script>

<template>
    <li class="group border-b-muted py-1 not-last-of-type:border-b">
        <div class="flex items-center gap-1">
            <div class="center cursor-move" data-handle>
                <UIcon :name="ICON_DRAG_VERTICAL" class="size-5.5 text-muted hover-none:size-6.5" />
            </div>
            <UCheckbox />
            <UInput
                :model-value="props.item.text"
                class="grow"
                variant="none"
                @update:model-value="value => (deferredText = value)"
            />
            <div class="flex hover-none:gap-1">
                <DateButtonPicker />
                <Button
                    :icon="ICON_CANCEL"
                    variant="ghost"
                    color="neutral"
                    class="center size-7 text-muted hover-none:size-8"
                />
            </div>
        </div>
    </li>
</template>
