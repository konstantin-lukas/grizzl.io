<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
import AccountTab from "~/finance/components/tabs/AccountTab.vue";

const items = ref<TabsItem[]>([
    {
        label: "account",
        icon: "material-symbols:account-balance-outline-rounded",
    },
    {
        label: "budgets",
        icon: "material-symbols:account-balance-wallet-outline-rounded",
    },
    {
        label: "bills",
        icon: "material-symbols:contract-outline-rounded",
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
