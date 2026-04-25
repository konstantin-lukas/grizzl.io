<script setup lang="ts">
import H2 from "~/core/components/typo/H2.vue";
import useToday from "~/core/composables/useToday";
import usePerMonthTransactions from "~/finance/composables/usePerMonthTransactions";

const { monthName } = useToday();
usePerMonthTransactions();
</script>

<template>
    <H2>{{ $t("finance.budgets.currentExpensesHeading", { month: monthName }) }}</H2>
    <H2>{{ $t("finance.budgets.categoryBudgetsHeading", { month: monthName }) }}</H2>
    <H2>{{ $t("finance.budgets.previousExpensesHeading") }}</H2>
</template>
