<script setup lang="ts">
import Slideover from "~/core/components/overlay/Slideover.vue";
import { useOpenList } from "~/todo/composables/useOpenList";
import Wrapper from "~/core/components/layout/Wrapper.vue";
import H1 from "~/core/components/typo/H1.vue";
import Button from "~/core/components/button/Button.vue";
import { ICON_OPTIONS } from "~/core/constants/icons.constant";
import DataSyncIndicator from "~/todo/components/DataSyncIndicator.vue";
import TodoListItem from "~/todo/components/TodoListItem.vue";

const { openList, openListCopy } = useOpenList();
</script>

<template>
    <Slideover query-key="list" :query-value="openList?.id" @close="openList = null">
        <Wrapper :class="{ 'max-w-xl': true }">
            <Button :icon="ICON_OPTIONS" color="neutral" variant="ghost" class="fixed top-4 right-4 aspect-square" />
            <DataSyncIndicator />
            <H1>{{ openListCopy?.title }}</H1>
            <ul v-if="openListCopy" class="mt-6">
                <TodoListItem v-for="item in openListCopy.items.uncompleted" :key="item.id" :item />
            </ul>
        </Wrapper>
    </Slideover>
</template>
