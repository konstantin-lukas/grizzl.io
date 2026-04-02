<script setup lang="ts">
import H2 from "~/core/components/typo/H2.vue";
import useTransactions from "~/finance/composables/useTransactions";

const { transactions } = useTransactions();
</script>

<template>
    <H2>Transactions</H2>
    {{ transactions }}
</template>

<style scoped></style>
