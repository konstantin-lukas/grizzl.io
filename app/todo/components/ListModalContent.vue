<script setup lang="ts">
import { useOpenList } from "~/todo/composables/useOpenList";
import H1 from "~/core/components/typo/H1.vue";
import Button from "~/core/components/button/Button.vue";
import { ICON_OPTIONS } from "~/core/constants/icons.constant";
import DataSyncIndicator from "~/todo/components/DataSyncIndicator.vue";
import TodoListItem from "~/todo/components/TodoListItem.vue";
import QueryModal from "~/todo/components/ListModalBase.vue";
import useMutationQueue from "~/todo/composables/useMutationQueue";

const { openList, openListCopy } = useOpenList();
const { queue } = useMutationQueue();
</script>

<template>
    <QueryModal
        query-key="list"
        :query-value="openList?.id"
        :unsaved-changes="queue.length > 0 ? 'todo.confirmClose' : undefined"
        @close="openList = null"
    >
        <div class="p-6 pt-7">
            <H1>{{ openListCopy?.title }}</H1>
            <ul v-if="openListCopy" class="mt-6 mb-4">
                <TodoListItem v-for="item in openListCopy.items.uncompleted" :key="item.id" :item />
            </ul>
            <USeparator />
            <ul v-if="openListCopy" class="mt-4">
                <TodoListItem v-for="item in openListCopy.items.completed" :key="item.id" :item />
            </ul>
        </div>
        <template #header>
            <Button :icon="ICON_OPTIONS" color="neutral" variant="ghost" class="absolute top-2 left-4 aspect-square" />
            <div class="absolute top-4.5 left-16 hover-none:top-5 hover-none:left-18">
                <DataSyncIndicator />
            </div>
        </template>
        <template #title>{{ $t("todo.aria.modal.title") }}</template>
        <template #description>{{ $t("todo.aria.modal.description") }}</template>
    </QueryModal>
</template>
