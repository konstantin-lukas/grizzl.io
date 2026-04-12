<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
import { ICON_BANK, ICON_BILL, ICON_WALLET } from "~/core/constants/icons.constant";
import AccountTab from "~/finance/components/tabs/AccountTab.vue";

const items = ref<TabsItem[]>([
    {
        label: "account",
        icon: ICON_BANK,
        slot: "account",
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
    <UTabs :items :ui="{ content: 'mt-8' }" :unmount-on-hide="false">
        <template #default="{ item }">
            {{ $t(`finance.tabs.${item.label}`) }}
        </template>
        <template #account>
            <AccountTab />
        </template>
    </UTabs>
</template>
