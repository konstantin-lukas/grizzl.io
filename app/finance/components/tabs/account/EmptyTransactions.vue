<script setup lang="ts">
import { ICON_FILTER } from "~/core/constants/icons.constant";
</script>

<template>
    <li class="absolute top-0 left-0 w-full pt-4">
        <div class="flex w-full flex-col items-center justify-center rounded-xl bg-elevated">
            <UEmpty
                variant="naked"
                :icon="ICON_FILTER"
                :title="$t('ui.noEntries')"
                :description="$t('finance.transaction.empty')"
                :ui="{ avatar: 'bg-default' }"
            />
        </div>
    </li>
</template>
