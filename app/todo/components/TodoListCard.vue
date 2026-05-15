<script setup lang="ts">
import CategoryIcon from "~/finance/components/CategoryIcon.vue";
import { ICON_CHEVRON_RIGHT } from "~/core/constants/icons.constant";
import type { TodoList } from "~/todo/useTodoLists";
const props = defineProps<{ list: TodoList }>();
const progress = computed(() => props.list.items.filter(item => item).length);
</script>

<template>
    <li class="mt-4">
        <div class="flex gap-4 rounded-xl bg-elevated p-4">
            <CategoryIcon :category-name="props.list.icon" />
            <div class="flex grow flex-col justify-between overflow-hidden">
                <span class="-mt-1 overflow-hidden text-xl text-ellipsis">{{ props.list.title }}</span>
                <UProgress v-model="progress" :max="props.list.items.length" :ui="{ base: 'h-4' }" class="w-full" />
            </div>
            <UButton
                :icon="ICON_CHEVRON_RIGHT"
                class="center size-12"
                :ui="{ leadingIcon: 'size-12' }"
                variant="link"
                color="neutral"
            />
        </div>
    </li>
</template>
