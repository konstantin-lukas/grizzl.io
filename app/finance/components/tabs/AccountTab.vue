<script setup lang="ts">
import H2 from "~/core/components/typo/H2.vue";
import useLocale from "~/core/composables/useLocale";
import BalanceChart from "~/finance/components/tabs/account/BalanceChart.vue";
import EmptyTransactions from "~/finance/components/tabs/account/EmptyTransactions.vue";
import TransactionCard from "~/finance/components/tabs/account/TransactionCard.vue";
import TransactionControls from "~/finance/components/tabs/account/TransactionControls.vue";
import TransactionUpsertForm from "~/finance/components/tabs/account/TransactionUpsertForm.vue";
import useAccounts from "~/finance/composables/useAccounts";
import useCategories from "~/finance/composables/useCategories";
import useTransactions, { type Transaction } from "~/finance/composables/useTransactions";

const { transactions } = useTransactions();
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
            :currency="openAccount!.currency"
            @open-insert-transaction-form="
                initialState = undefined;
                upsertFormOpen = true;
            "
        />
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
