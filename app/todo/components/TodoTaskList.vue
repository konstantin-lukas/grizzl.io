<script setup lang="ts">
import TodoTask from "~/todo/components/TodoTask.vue";
import type { SortableEvent } from "vue-draggable-plus";
import { VueDraggable } from "vue-draggable-plus";
import { useOpenList } from "~/todo/composables/useOpenList";
import useMutationQueue from "~/todo/composables/useMutationQueue";

const { uncompletedItems, id } = useOpenList();
const { queue } = useMutationQueue();

const moveItem = (event: SortableEvent & { data: { id: string } }) => {
    if (!id.value || !event.oldIndex || !event.newIndex) return;
    queue.value.push({ action: "move", id: event.data.id, from: event.oldIndex, to: event.newIndex, listId: id.value });
};
</script>

<template>
    <div v-if="uncompletedItems.length > 0">
        <VueDraggable
            v-model="uncompletedItems"
            :animation="250"
            class="mt-6"
            tag="ul"
            handle="[data-handle]"
            ghost-class="ghost"
            @end="moveItem"
        >
            <TransitionGroup name="draggable-list">
                <TodoTask v-for="item in uncompletedItems" :key="item.id" :item />
            </TransitionGroup>
        </VueDraggable>
    </div>
</template>

<style scoped></style>
