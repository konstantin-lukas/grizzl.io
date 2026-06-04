<script setup lang="ts">
import { ICON_RETURN } from "~/core/constants/icons.constant";
import Button from "~/core/components/button/Button.vue";
import DateCarousel from "~/todo/components/calendar/DateCarousel.vue";
import Wrapper from "~/core/components/layout/Wrapper.vue";
import TodoList from "~/todo/components/calendar/TodoList.vue";

const { data } = await useFetch("/api/todo/lists");
</script>

<template>
    <div class="pt-12 sm:pt-12 hover-none:pt-16">
        <DateCarousel />
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
        <Wrapper class="max-w-xl pt-16">
            <TodoList v-for="list in data" :list />
        </Wrapper>
    </div>
</template>
