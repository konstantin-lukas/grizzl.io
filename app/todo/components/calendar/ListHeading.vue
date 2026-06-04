<script setup lang="ts">
import CategoryIcon from "~/core/components/icon/CategoryIcon.vue";
import type { TodoList } from "~/todo/composables/useTodoLists";
import H1 from "~/core/components/typo/H1.vue";
const props = defineProps<{ list: TodoList }>();
</script>

<template>
    <div class="flex gap-4">
        <CategoryIcon :category-name="props.list.icon" />
        <H1 class="wrap-break-word">{{ props.list.title }}</H1>
    </div>
</template>

<style scoped></style>
