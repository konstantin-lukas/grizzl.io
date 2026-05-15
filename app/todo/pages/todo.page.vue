<script setup lang="ts">
import Wrapper from "~/core/components/layout/Wrapper.vue";
import H1 from "~/core/components/typo/H1.vue";
import TodoListCard from "~/todo/components/TodoListCard.vue";
import useTodoLists from "~/todo/useTodoLists";
const todoLists = useTodoLists();
</script>

<template>
    <Wrapper>
        <H1>{{ $t("todo.mainHeading") }}</H1>
        <ul>
            <TodoListCard v-for="todoList in todoLists" :key="todoList.id" :list="todoList" />
        </ul>
    </Wrapper>
</template>
