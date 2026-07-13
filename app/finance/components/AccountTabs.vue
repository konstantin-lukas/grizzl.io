<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
import { ICON_BANK, ICON_BILL, ICON_WALLET } from "~/core/constants/icons.constant";
import AccountTab from "~/finance/components/tabs/AccountTab.vue";
import BillsTab from "~/finance/components/tabs/BillsTab.vue";
import BudgetsTab from "~/finance/components/tabs/BudgetsTab.vue";
import useAutoTransactions from "~/finance/composables/useAutoTransactions";

const items = ref<TabsItem[]>([
    {
        label: "account",
        icon: ICON_BANK,
        slot: "account",
    },
    {
        label: "budgets",
        icon: ICON_WALLET,
        slot: "budgets",
    },
    {
        label: "bills",
        icon: ICON_BILL,
        slot: "bills",
    },
]);

const { refresh } = useAutoTransactions();
</script>

<template>
    <UTabs :items :ui="{ content: 'mt-8' }" :unmount-on-hide="false" @update:model-value="() => refresh()">
        <template #default="{ item }">
            <span data-test-id="finance-tab">
                {{ $t(`finance.tabs.${item.label}`) }}
            </span>
        </template>
        <template #account>
            <AccountTab />
        </template>
        <template #bills>
            <BillsTab />
        </template>
        <template #budgets>
            <BudgetsTab />
        </template>
    </UTabs>
</template>
