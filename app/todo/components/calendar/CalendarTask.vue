<script setup lang="ts">
import type { TodoList } from "~/todo/composables/useTodoLists";
import useVirtualization from "~/todo/composables/useVirtualization";

const props = defineProps<{ item: TodoList["items"]["completed"][number] }>();
const el = ref(null);
const isVisible = useVirtualization(el);
</script>

<template>
    <li ref="el" class="mt-8">
        <Transition name="fade">
            <div v-if="isVisible">
                {{ props.item.text }}
            </div>
        </Transition>
    </li>
</template>
