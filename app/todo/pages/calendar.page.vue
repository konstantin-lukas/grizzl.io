<script setup lang="ts">
import { ICON_RETURN } from "~/core/constants/icons.constant";
import Button from "~/core/components/button/Button.vue";
import DateCarousel from "~/todo/components/calendar/DateCarousel.vue";
import Wrapper from "~/core/components/layout/Wrapper.vue";
import { parseCalendarDate } from "~/core/utils/date";
import useToday from "~/core/composables/useToday";
import type { TodoList as List } from "~/todo/composables/useTodoLists";
import EmptyCard from "~/core/components/data/EmptyCard.vue";
import TodoList from "~/todo/components/calendar/TodoList.vue";
import ListLoadingSkeleton from "~/todo/components/calendar/ListLoadingSkeleton.vue";

const { data } = await useFetch("/api/todo/lists");
const { today } = useToday();
const toggle = ref(false);
const selectedDate = ref();

onMounted(() => (selectedDate.value = today.value));

const checkIsEmpty = (item: List["items"]["completed"][number]) => {
    if (!item.scheduledFor) return true;
    const parsedDate = parseCalendarDate(item.scheduledFor);
    return selectedDate.value?.compare(parsedDate) !== 0;
};

const isEmpty = computed(() => {
    if (!data.value) return true;

    return data.value.every(
        list => list.items.completed.every(checkIsEmpty) && list.items.uncompleted.every(checkIsEmpty),
    );
});
</script>

<template>
    <div class="pt-12 sm:pt-12 hover-none:pt-16">
        <DateCarousel
            @update="
                date => {
                    selectedDate = date;
                    toggle = !toggle;
                }
            "
        />
        <USeparator />
        <Button
            :icon="ICON_RETURN"
            variant="ghost"
            color="neutral"
            class="fixed top-4 right-4 flex size-10 justify-center hover-none:size-12"
            :aria-label="$t('ui.goBack')"
            data-test-id="go-back-button"
            to="/todo"
        />
        <Wrapper class="relative max-w-xl px-0! pt-16">
            <Transition name="fade-absolute">
                <div v-if="isEmpty && today" class="absolute top-16 left-0 w-full px-8">
                    <EmptyCard description-translation-key="todo.noneToday" />
                </div>
                <div v-else-if="today && toggle" class="w-full px-8">
                    <TodoList v-for="list in data" :key="list.id" :list :ref-date="selectedDate" />
                </div>
                <div v-else-if="today && !toggle" class="w-full px-8">
                    <TodoList v-for="list in data" :key="list.id" :list :ref-date="selectedDate" />
                </div>
                <div v-else class="absolute top-0 left-0 w-full px-8">
                    <ListLoadingSkeleton />
                </div>
            </Transition>
        </Wrapper>
    </div>
</template>
