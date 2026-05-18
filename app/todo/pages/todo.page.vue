<script setup lang="ts">
import Wrapper from "~/core/components/layout/Wrapper.vue";
import H1 from "~/core/components/typo/H1.vue";
import TodoListCard from "~/todo/components/TodoListCard.vue";
import useTodoLists from "../composables/useTodoLists";
import Button from "~/core/components/button/Button.vue";
import { ICON_CALENDAR, ICON_PLUS } from "~/core/constants/icons.constant";
import EmptyCard from "../../core/components/data/EmptyCard.vue";
import { useOpenList } from "~/todo/composables/useOpenList";
import ListModal from "../components/ListModalContent.vue";
import { onResponseError } from "~/core/utils/toast";
import { useToast } from "#ui/composables";
import useOnSubmit from "~/core/composables/useOnSubmit";

const route = useRoute();
const toast = useToast();
const { t } = useI18n();
const { todoLists } = useTodoLists();
const { openList } = useOpenList();
const { data, refresh } = await useFetch("/api/todo/lists", {
    onResponseError: onResponseError(toast, t),
});
const createTodoList = useOnSubmit({
    url: () => "/api/todo/lists",
    method: () => "POST",
    state: {
        icon: "question-mark-rounded",
    },
    transform: ({ ...state }) => ({ ...state, title: t("todo.newList") }),
    translationKey: "todo",
    refresh: () => refresh(),
});

watchEffect(() => {
    if (!data.value) return;
    todoLists.value = data.value;
});

watchEffect(() => {
    const id = route.query.list;
    openList.value = data.value?.find(list => list.id === id) ?? null;
});
</script>

<template>
    <Wrapper :class="{ 'max-w-xl': true }">
        <H1 class="mb-12">{{ $t("todo.mainHeading") }}</H1>
        <div class="mt-4 mb-4 flex gap-4 not-xs:flex-col">
            <Button
                class="flex w-full justify-center"
                :icon="ICON_PLUS"
                :on-async-click="createTodoList"
                data-test-id="todo-list-add-button"
            >
                {{ $t("ui.add") }}
            </Button>
            <Button class="flex w-full justify-center" :icon="ICON_CALENDAR" to="/todo/calendar">
                {{ $t("todo.calendar") }}
            </Button>
        </div>
        <USeparator />
        <ul>
            <li v-if="todoLists?.length === 0">
                <EmptyCard class="mt-4" />
            </li>
            <TransitionGroup name="list">
                <TodoListCard
                    v-for="todoList in todoLists"
                    :key="todoList.id"
                    :list="todoList"
                    @open="openList = todoList"
                />
            </TransitionGroup>
        </ul>
        <ListModal />
    </Wrapper>
</template>
