<script setup lang="ts">
import type { TodoList } from "~/todo/composables/useTodoLists";
import ListHeading from "~/todo/components/calendar/ListHeading.vue";
import { parseCalendarDate } from "~/core/utils/date";
import type { CalendarDate } from "@internationalized/date";
import CalendarTask from "~/todo/components/calendar/CalendarTask.vue";
import UAccordion from "#ui/components/Accordion.vue";

type TodoItem = TodoList["items"]["completed"][number];

const emit = defineEmits<{ (e: "check", value: boolean, listId: string, item: TodoItem): void }>();
const props = defineProps<{ list: TodoList; refDate?: CalendarDate }>();

const filterTasks = (item: TodoItem) => {
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
        <ul class="mt-4">
            <CalendarTask
                v-for="item in uncompletedItems"
                :key="item.id"
                :item="item"
                type="uncompleted"
                @check="(value, id) => emit('check', value, list.id, id)"
            />
        </ul>
        <USeparator v-if="completedItems.length > 0" :class="uncompletedItems.length === 0 ? 'mt-6' : 'mt-2'" />
        <Transition name="fade">
            <UAccordion
                v-if="completedItems.length > 0"
                :items="[{ label: $t('todo.completedItems', completedItems.length) }]"
                :ui="{
                    trailingIcon: 'mr-1',
                    label: 'text-muted',
                    header: 'mt-0.5',
                    content: 'relative -left-2',
                }"
                data-test-id="todo-completed-items-accordion"
            >
                <template #content>
                    <ul class="relative left-2">
                        <CalendarTask
                            v-for="item in completedItems"
                            :key="item.id"
                            :item="item"
                            type="completed"
                            @check="(value, id) => emit('check', value, list.id, id)"
                        />
                    </ul>
                </template>
            </UAccordion>
        </Transition>
    </div>
</template>
