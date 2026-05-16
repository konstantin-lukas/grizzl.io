<script setup lang="ts">
import Wrapper from "~/core/components/layout/Wrapper.vue";
import H1 from "~/core/components/typo/H1.vue";
import TodoListCard from "~/todo/components/TodoListCard.vue";
import useTodoLists from "~/todo/useTodoLists";
import Button from "~/core/components/button/Button.vue";
import { ICON_CALENDAR, ICON_PLUS } from "~/core/constants/icons.constant";
import EmptyBudgets from "../../core/components/data/EmptyCard.vue";
const { todoLists, createTodoList } = useTodoLists();
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
                <EmptyBudgets class="mt-4" />
            </li>
            <TransitionGroup name="list">
                <TodoListCard v-for="todoList in todoLists" :key="todoList.id" :list="todoList" />
            </TransitionGroup>
        </ul>
    </Wrapper>
</template>
