<script setup lang="ts">
import H2 from "~/core/components/typo/H2.vue";
import useLocale from "~/core/composables/useLocale";
import { ICON_FILTER } from "~/core/constants/icons.constant";
import TransactionCardSkeleton from "~/finance/components/TransactionCardSkeleton.vue";
import BalanceChart from "~/finance/components/tabs/account/BalanceChart.vue";
import TransactionCard from "~/finance/components/tabs/account/TransactionCard.vue";
import TransactionControls from "~/finance/components/tabs/account/TransactionControls.vue";
import TransactionUpsertForm from "~/finance/components/tabs/account/TransactionUpsertForm.vue";
import EmptyBudgets from "~/finance/components/tabs/budgets/EmptyBudgets.vue";
import useAccounts from "~/finance/composables/useAccounts";
import useCategories from "~/finance/composables/useCategories";
import useTransactions, { type Transaction } from "~/finance/composables/useTransactions";

const { transactions, isFetching } = useTransactions();
const { openAccount } = useAccounts();
const { language } = useLocale();
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
        <TransactionControls
            :locale="language"
            :currency="openAccount?.currency ?? 'USD'"
            @open-insert-transaction-form="
                initialState = undefined;
                upsertFormOpen = true;
            "
            @update-auto-transactions="refresh"
        />
    </div>
    <BalanceChart />
    <H2 class="mt-12">{{ $t("finance.account.transactionHistory") }}</H2>
    <div aria-live="polite">
        <div v-if="isFetching">
            <TransactionCardSkeleton v-for="n in 10" :key="n" />
        </div>
        <ul v-else class="relative min-h-32">
            <TransitionGroup name="list">
                <TransactionCard
                    v-for="transaction in transactions"
                    :key="transaction.id"
                    data-test-id="finance-transaction-card"
                    :transaction
                    @edit="
                        initialState = transaction;
                        upsertFormOpen = true;
                    "
                />
            </TransitionGroup>
            <Transition name="list">
                <li v-if="transactions.length === 0" class="absolute top-0 left-0 w-full pt-4">
                    <EmptyBudgets
                        :icon="ICON_FILTER"
                        title-translation-key="ui.noEntries"
                        description-translation-key="finance.transaction.empty"
                    />
                </li>
            </Transition>
        </ul>
    </div>
    <TransactionUpsertForm
        v-model:open="upsertFormOpen"
        :initial-state="initialState"
        @success="upsertFormOpen = false"
    />
</template>
