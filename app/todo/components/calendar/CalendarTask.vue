<script setup lang="ts">
import type { TodoList } from "~/todo/composables/useTodoLists";
import useVirtualization from "~/todo/composables/useVirtualization";
import { ICON_CANCEL } from "~/core/constants/icons.constant";
import Button from "~/core/components/button/Button.vue";

type TodoItem = TodoList["items"]["completed"][number];

const emit = defineEmits<{ (e: "check", value: boolean, item: TodoItem): void }>();
const props = defineProps<{ item: TodoItem; type: "completed" | "uncompleted" }>();
const el = ref(null);
const checked = ref(props.type === "completed");

const isVisible = useVirtualization(el, true);

watch(checked, value => {
    emit("check", value, props.item);
});
</script>

<template>
    <li ref="el" class="box-border flex h-10.5 flex-col justify-center border-y border-y-transparent py-1">
        <Transition name="fade">
            <div v-if="isVisible" class="flex items-center justify-between gap-4">
                <UCheckbox v-model="checked" data-test-id="todo-item-checkbox" :aria-labelledby="props.item.id" />
                <span
                    :id="props.item.id"
                    class="grow overflow-hidden text-sm text-ellipsis"
                    :class="{ 'text-muted line-through': props.type === 'completed' }"
                >
                    {{ props.item.text }}
                </span>
                <Button
                    :icon="ICON_CANCEL"
                    variant="ghost"
                    color="neutral"
                    class="center size-7 text-muted hover-none:size-8"
                    :aria-label="$t('todo.aria.deleteTask')"
                    data-test-id="todo-item-delete-button"
                />
            </div>
        </Transition>
    </li>
</template>
