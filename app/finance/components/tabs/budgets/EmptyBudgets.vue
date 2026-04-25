<script setup lang="ts">
import { ICON_BILL } from "~/core/constants/icons.constant";
</script>

<template>
    <div class="flex w-full flex-col items-center justify-center rounded-xl bg-elevated">
        <UEmpty
            variant="naked"
            :icon="ICON_BILL"
            :title="$t('ui.noEntries')"
            :description="$t('finance.budgets.noExpenses')"
            :ui="{ avatar: 'bg-default' }"
        />
    </div>
</template>
