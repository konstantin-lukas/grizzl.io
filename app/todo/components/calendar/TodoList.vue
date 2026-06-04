<script setup lang="ts">
import type { TodoList } from "~/todo/composables/useTodoLists";
import ListHeading from "~/todo/components/calendar/ListHeading.vue";
import useToday from "~/core/composables/useToday";
import { parseCalendarDate } from "~/core/utils/date";
const props = defineProps<{ list: TodoList }>();
const { today } = useToday();

const filterTasks = (item: TodoList["items"]["completed"][number]) => {
    if (!item.scheduledFor) return false;
    const parsedDate = parseCalendarDate(item.scheduledFor);
    return today.value?.compare(parsedDate) === 0;
};

const uncompletedItems = computed(() => props.list.items.uncompleted.filter(filterTasks));
const completedItems = computed(() => props.list.items.completed.filter(filterTasks));
</script>

<template>
    <div class="mb-16">
        <ListHeading :list="props.list" />
        <div v-for="item in uncompletedItems" :key="item.id">
            {{ item.text }}
        </div>
        <USeparator />
        <div v-for="item in completedItems" :key="item.id">
            {{ item.text }}
        </div>
    </div>
</template>
