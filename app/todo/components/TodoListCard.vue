<script setup lang="ts">
import CategoryIcon from "~/core/components/icon/CategoryIcon.vue";
import { ICON_CHEVRON_RIGHT } from "~/core/constants/icons.constant";
import type { TodoList } from "~/todo/composables/useTodoLists";

const props = defineProps<{ list: TodoList }>();
const emit = defineEmits(["open"]);

const progress = computed(() => props.list.items.completed.length);
const target = computed(() => props.list.items.completed.length + props.list.items.uncompleted.length);
</script>

<template>
    <li class="mt-4 w-full">
        <div class="flex gap-4 rounded-xl bg-elevated p-4">
            <CategoryIcon :category-name="props.list.icon" />
            <div class="flex grow flex-col justify-between overflow-hidden">
                <span class="-mt-1 flex justify-between gap-4 text-xl text-nowrap">
                    <span class="overflow-hidden text-ellipsis">{{ props.list.title }}</span>
                    <span class="text-muted">{{ `${progress}/${target}` }}</span>
                </span>
                <UProgress v-model="progress" :max="target" :ui="{ base: 'h-4' }" class="w-full" />
            </div>
            <UButton
                :icon="ICON_CHEVRON_RIGHT"
                class="center h-12 w-8"
                :ui="{ leadingIcon: 'size-12' }"
                variant="link"
                color="neutral"
                :aria-label="$t('ui.open')"
                data-test-id="todo-open-list-button"
                @click="emit('open')"
            />
        </div>
    </li>
</template>
