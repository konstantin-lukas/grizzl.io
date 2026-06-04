<script setup lang="ts">
import type { TodoList } from "~/todo/composables/useTodoLists";
import ListHeading from "~/todo/components/calendar/ListHeading.vue";
import { parseCalendarDate } from "~/core/utils/date";
import type { CalendarDate } from "@internationalized/date";
import CalendarTask from "~/todo/components/calendar/CalendarTask.vue";
const props = defineProps<{ list: TodoList; refDate?: CalendarDate }>();

const filterTasks = (item: TodoList["items"]["completed"][number]) => {
    if (!item.scheduledFor) return false;
    const parsedDate = parseCalendarDate(item.scheduledFor);
    return props.refDate?.compare(parsedDate) === 0;
};

const uncompletedItems = computed(() => props.list.items.uncompleted.filter(filterTasks));
const completedItems = computed(() => props.list.items.completed.filter(filterTasks));
</script>

<template>
    <div v-if="uncompletedItems.length > 0 || completedItems.length > 0" class="mb-16">
        <ListHeading :list="props.list" />
        <ul v-for="item in uncompletedItems" :key="item.id">
            <CalendarTask :item="item" />
        </ul>
        <USeparator />
        <ul v-for="item in completedItems" :key="item.id">
            <CalendarTask :item="item" />
        </ul>
    </div>
</template>
