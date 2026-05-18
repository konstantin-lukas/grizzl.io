<script setup lang="ts">
import { useOpenList } from "~/todo/composables/useOpenList";
import H1 from "~/core/components/typo/H1.vue";
import Button from "~/core/components/button/Button.vue";
import { ICON_OPTIONS } from "~/core/constants/icons.constant";
import DataSyncIndicator from "~/todo/components/DataSyncIndicator.vue";
import TodoListItem from "~/todo/components/TodoListItem.vue";
import QueryModal from "~/core/components/overlay/QueryModal.vue";
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
        <div class="p-6 pt-18">
            <Button :icon="ICON_OPTIONS" color="neutral" variant="ghost" class="absolute top-4 left-4 aspect-square" />
            <DataSyncIndicator class="absolute top-6.5 left-16" />
            <H1>{{ openListCopy?.title }}</H1>
            <ul v-if="openListCopy" class="mt-6">
                <TodoListItem v-for="item in openListCopy.items.uncompleted" :key="item.id" :item />
            </ul>
        </div>
        <template #title>{{ $t("todo.aria.modal.title") }}</template>
        <template #description>{{ $t("todo.aria.modal.description") }}</template>
    </QueryModal>
</template>
