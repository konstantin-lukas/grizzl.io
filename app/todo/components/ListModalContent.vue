<script setup lang="ts">
import { useOpenList } from "~/todo/composables/useOpenList";
import H1 from "~/core/components/typo/H1.vue";
import Button from "~/core/components/button/Button.vue";
import { ICON_OPTIONS, ICON_PLUS } from "~/core/constants/icons.constant";
import DataSyncIndicator from "~/todo/components/DataSyncIndicator.vue";
import TodoTask from "./TodoTask.vue";
import QueryModal from "~/todo/components/ListModalBase.vue";
import useMutationQueue from "~/todo/composables/useMutationQueue";
import UAccordion from "#ui/components/Accordion.vue";
import { type SortableEvent, VueDraggable } from "vue-draggable-plus";

const emit = defineEmits(["close"]);

const { openList, title, completedItems, uncompletedItems, id, persistChanges, generateNewID } = useOpenList();
const { queue } = useMutationQueue();

const addItem = () => {
    const newId = generateNewID();
    queue.value.push({ action: "create", id: newId, listId: id.value, text: "", index: uncompletedItems.value.length });
    uncompletedItems.value.push({ id: newId, text: "", scheduledFor: null });
};

const moveItem = (event: SortableEvent & { data: { id: string } }) => {
    if (!id.value || typeof event.oldIndex !== "number" || typeof event.newIndex !== "number") return;
    queue.value.push({ action: "move", id: event.data.id, from: event.oldIndex, to: event.newIndex, listId: id.value });
};
</script>

<template>
    <QueryModal
        query-key="list"
        :query-value="openList?.id"
        :unsaved-changes="queue.length > 0 ? 'todo.confirmClose' : undefined"
        @close="
            persistChanges();
            openList = null;
            emit('close');
        "
    >
        <div class="p-6 pt-8">
            <H1>{{ title }}</H1>
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
                        <TodoTask
                            v-for="(item, index) in uncompletedItems"
                            :key="item.id"
                            :index
                            :item
                            type="uncompleted"
                        />
                    </TransitionGroup>
                </VueDraggable>
            </div>
            <div class="mt-2 mb-4" :class="{ 'mt-8': uncompletedItems.length === 0 }">
                <Button :icon="ICON_PLUS" variant="ghost" class="w-full pl-6" @click="addItem">
                    {{ $t("ui.add") }}
                </Button>
            </div>
            <USeparator v-if="completedItems.length > 0" />
            <Transition name="fade">
                <UAccordion
                    v-if="completedItems.length > 0"
                    :items="[{ label: $t('todo.completedItems', completedItems.length) }]"
                    :ui="{ trailingIcon: 'mr-1.5', label: 'ml-2 text-muted' }"
                >
                    <template #content>
                        <ul>
                            <TransitionGroup name="draggable-list">
                                <TodoTask
                                    v-for="(item, index) in completedItems"
                                    :key="item.id"
                                    :index
                                    :item
                                    type="completed"
                                />
                            </TransitionGroup>
                        </ul>
                    </template>
                </UAccordion>
            </Transition>
        </div>
        <template #header>
            <Button
                :icon="ICON_OPTIONS"
                color="neutral"
                variant="ghost"
                class="absolute top-2 left-4 aspect-square"
                :aria-label="$t('todo.aria.todoListSettings')"
            />
            <div class="absolute top-4.5 left-16 hover-none:top-5 hover-none:left-18">
                <DataSyncIndicator />
            </div>
        </template>
        <template #title>{{ $t("todo.aria.modal.title") }}</template>
        <template #description>{{ $t("todo.aria.modal.description") }}</template>
    </QueryModal>
</template>
