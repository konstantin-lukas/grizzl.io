<script setup lang="ts">
import H2 from "~/core/components/typo/H2.vue";
import useToday from "~/core/composables/useToday";
import ExpenseDonut from "~/finance/components/tabs/budgets/ExpenseDonut.vue";
import useAccounts from "~/finance/composables/useAccounts";
import usePerMonthTransactions from "~/finance/composables/usePerMonthTransactions";

const { monthName } = useToday();
const { perMonthPerCategory } = usePerMonthTransactions();
const { openAccount } = useAccounts();
const currency = computed(() => openAccount.value?.currency ?? "USD");
const thisMonthsExpenses = computed(() => perMonthPerCategory.value[perMonthPerCategory.value.length - 1] ?? []);
</script>

<template>
    <Transition name="fade">
        <H2 v-if="thisMonthsExpenses.length > 0">
            {{ $t("finance.budgets.currentExpensesHeading", { month: monthName }) }}
        </H2>
    </Transition>
    <Transition name="fade">
        <ExpenseDonut v-if="thisMonthsExpenses.length > 0" :expenses="thisMonthsExpenses" :currency />
    </Transition>
    <H2>{{ $t("finance.budgets.categoryBudgetsHeading", { month: monthName }) }}</H2>
    <H2>{{ $t("finance.budgets.previousExpensesHeading") }}</H2>
</template>
