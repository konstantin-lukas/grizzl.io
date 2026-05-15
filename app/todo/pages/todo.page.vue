<script setup lang="ts">
import Wrapper from "~/core/components/layout/Wrapper.vue";
import H1 from "~/core/components/typo/H1.vue";
import TodoListCard from "~/todo/components/TodoListCard.vue";
import useTodoLists from "~/todo/useTodoLists";
import Button from "~/core/components/button/Button.vue";
import { ICON_CALENDAR, ICON_PLUS } from "~/core/constants/icons.constant";
const todoLists = useTodoLists();
</script>

<template>
    <Wrapper :class="{ 'max-w-xl': true }">
        <H1 class="mb-12">{{ $t("todo.mainHeading") }}</H1>
        <div class="mt-4 mb-4 flex gap-4 not-xs:flex-col">
            <Button class="flex w-full justify-center" :icon="ICON_PLUS">{{ $t("ui.add") }}</Button>
            <Button class="flex w-full justify-center" :icon="ICON_CALENDAR">{{ $t("todo.calendar") }}</Button>
        </div>
        <USeparator />
        <ul>
            <TodoListCard v-for="todoList in todoLists" :key="todoList.id" :list="todoList" />
        </ul>
    </Wrapper>
</template>
