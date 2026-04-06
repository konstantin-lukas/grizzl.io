<script setup lang="ts">
import Button from "~/core/components/button/Button.vue";
import H2 from "~/core/components/typo/H2.vue";
import { ICON_EVENT_REPEAT, ICON_PLUS_CIRCLE } from "~/core/constants/icons.constant";
import BalanceChart from "~/finance/components/tabs/account/BalanceChart.vue";
import Transaction from "~/finance/components/tabs/account/TransactionCard.vue";
import TransactionFilters from "~/finance/components/tabs/account/TransactionFilters.vue";
import useTransactions from "~/finance/composables/useTransactions";

const { transactions } = useTransactions();
</script>

<template>
    <div class="flex items-end justify-between">
        <H2 class="mb-2">{{ $t("finance.account.balance") }}</H2>
        <div class="shrink-0 -translate-y-2">
            <Button
                :icon="ICON_PLUS_CIRCLE"
                square
                variant="ghost"
                color="neutral"
                :aria-label="$t('finance.account.addTransaction')"
            />
            <Button
                :icon="ICON_EVENT_REPEAT"
                square
                variant="ghost"
                color="neutral"
                :aria-label="$t('finance.account.manageAutoTransactions')"
            />
            <TransactionFilters />
        </div>
    </div>
    <BalanceChart />
    <H2 class="mt-12">{{ $t("finance.account.transactionHistory") }}</H2>
    <div class="mt-4 flex flex-col gap-4">
        <Transaction v-for="transaction in transactions" :key="transaction.id" :transaction />
    </div>
</template>
