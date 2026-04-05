<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
import { ICON_BANK, ICON_BILL, ICON_WALLET } from "~/core/constants/icons.constant";
import AccountTab from "~/finance/components/tabs/AccountTab.vue";

const items = ref<TabsItem[]>([
    {
        label: "account",
        icon: ICON_BANK,
    },
    {
        label: "budgets",
        icon: ICON_WALLET,
    },
    {
        label: "bills",
        icon: ICON_BILL,
    },
]);
</script>

<template>
    <UTabs :items :ui="{ content: 'mt-6' }">
        <template #default="{ item }">
            {{ $t(`finance.tabs.${item.label}`) }}
        </template>
        <template #content="{ item }">
            <AccountTab v-if="item.label === 'account'" />
        </template>
    </UTabs>
</template>
