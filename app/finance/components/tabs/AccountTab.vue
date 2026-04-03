<script setup lang="ts">
import H2 from "~/core/components/typo/H2.vue";
import Transaction from "~/finance/components/tabs/account/TransactionCard.vue";
import useTransactions from "~/finance/composables/useTransactions";

const { transactions } = useTransactions();
</script>

<template>
    <H2>{{ $t("finance.account.transactionHistory") }}</H2>
    <div class="mt-4 flex flex-col gap-4">
        <Transaction v-for="transaction in transactions" :key="transaction.id" :transaction />
    </div>
</template>

<style scoped></style>
