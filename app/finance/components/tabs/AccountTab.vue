<script setup lang="ts">
import Button from "~/core/components/button/Button.vue";
import H2 from "~/core/components/typo/H2.vue";
import { ICON_EVENT_REPEAT, ICON_PLUS_CIRCLE } from "~/core/constants/icons.constant";
import BalanceChart from "~/finance/components/tabs/account/BalanceChart.vue";
import EmptyTransactions from "~/finance/components/tabs/account/EmptyTransactions.vue";
import TransactionCard from "~/finance/components/tabs/account/TransactionCard.vue";
import TransactionFilters from "~/finance/components/tabs/account/TransactionFilters.vue";
import TransactionUpsertForm from "~/finance/components/tabs/account/TransactionUpsertForm.vue";
import useCategories from "~/finance/composables/useCategories";
import useTransactions, { type Transaction } from "~/finance/composables/useTransactions";

const { transactions } = useTransactions();
const { refresh } = useCategories();
const initialState = ref<Transaction>();
const upsertFormOpen = ref(false);
watch(upsertFormOpen, isOpen => {
    if (isOpen) refresh();
});
</script>

<template>
    <div class="flex items-end justify-between">
        <H2 class="mb-4">{{ $t("finance.account.balance") }}</H2>
        <div class="flex shrink-0 -translate-y-3 gap-1">
            <Button
                :icon="ICON_PLUS_CIRCLE"
                square
                variant="ghost"
                color="neutral"
                :aria-label="$t('finance.account.addTransaction')"
                @click="
                    initialState = undefined;
                    upsertFormOpen = true;
                "
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
    <ul class="relative min-h-32">
        <TransitionGroup name="list">
            <TransactionCard
                v-for="transaction in transactions"
                :key="transaction.id"
                :transaction
                @edit="
                    initialState = transaction;
                    upsertFormOpen = true;
                "
            />
        </TransitionGroup>
        <Transition name="list">
            <EmptyTransactions v-if="transactions.length === 0" />
        </Transition>
    </ul>
    <TransactionUpsertForm
        v-model:open="upsertFormOpen"
        :initial-state="initialState"
        @success="upsertFormOpen = false"
    />
</template>
