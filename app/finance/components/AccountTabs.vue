<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";

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
    <UTabs :items :ui="{ content: 'mt-8' }">
        <template #default="{ item }">
            {{ $t(`finance.tabs.${item.label}`) }}
        </template>
        <template #content="{ item }">
            {{ item.label }}
        </template>
    </UTabs>
</template>
