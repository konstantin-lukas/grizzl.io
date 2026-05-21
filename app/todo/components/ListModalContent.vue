<script setup lang="ts">
import { useOpenList } from "~/todo/composables/useOpenList";
import H1 from "~/core/components/typo/H1.vue";
import Button from "~/core/components/button/Button.vue";
import { ICON_OPTIONS } from "~/core/constants/icons.constant";
import DataSyncIndicator from "~/todo/components/DataSyncIndicator.vue";
import TodoTask from "./TodoTask.vue";
import QueryModal from "~/todo/components/ListModalBase.vue";
import useMutationQueue from "~/todo/composables/useMutationQueue";
import TodoTaskList from "./TodoTaskList.vue";
import UAccordion from "#ui/components/Accordion.vue";

const emit = defineEmits(["close"]);

const { openList, title, completedItems, uncompletedItems, persistChanges } = useOpenList();
const { queue } = useMutationQueue();
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
            <TodoTaskList />
            <USeparator v-if="completedItems.length > 0 && uncompletedItems.length > 0" />
            <Transition name="fade">
                <UAccordion
                    v-if="completedItems.length > 0"
                    :items="[{ label: $t('todo.completedItems', completedItems.length) }]"
                    :ui="{ trailingIcon: 'mr-1.5', label: 'ml-2 text-muted' }"
                >
                    <template #content>
                        <ul>
                            <TransitionGroup name="draggable-list">
                                <TodoTask v-for="item in completedItems" :key="item.id" :item />
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
