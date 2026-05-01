<script setup lang="ts">
import H2 from "~/core/components/typo/H2.vue";
import useToday from "~/core/composables/useToday";
import { ICON_FINANCE } from "~/core/constants/icons.constant";
import CategoryBudgets from "~/finance/components/tabs/budgets/CategoryBudgets.vue";
import EmptyBudgets from "~/finance/components/tabs/budgets/EmptyBudgets.vue";
import ExpensePieChart from "~/finance/components/tabs/budgets/ExpensePieChart.vue";
import StackedExpenses from "~/finance/components/tabs/budgets/StackedExpenses.vue";
import useAccounts from "~/finance/composables/useAccounts";
import usePerMonthTransactions from "~/finance/composables/usePerMonthTransactions";

const { monthName } = useToday();
const { perMonthPerCategory, refresh, isFetching } = usePerMonthTransactions();
const { openAccount } = useAccounts();
const currency = computed(() => openAccount.value?.currency ?? "USD");
const thisMonthsExpenses = computed(() => perMonthPerCategory.value[perMonthPerCategory.value.length - 1] ?? []);

watchEffect(() => {
    refresh(openAccount.value?.id ?? "");
});
</script>

<template>
    <H2>{{ $t("finance.budgets.currentExpensesHeading", { month: monthName }) }}</H2>
    <EmptyBudgets
        v-if="thisMonthsExpenses.length === 0"
        class="mt-4"
        description-translation-key="finance.budgets.noExpenses"
        :icon="ICON_FINANCE"
    />
    <ExpensePieChart v-else :expenses="thisMonthsExpenses" :currency :is-fetching />
    <H2 class="mt-12">
        {{ $t("finance.budgets.categoryBudgetsHeading", { month: monthName }) }}
    </H2>
    <CategoryBudgets :expenses="thisMonthsExpenses" :currency :is-fetching />
    <H2 class="mt-12">{{ $t("finance.budgets.previousExpensesHeading") }}</H2>
    <StackedExpenses :expenses="perMonthPerCategory" :currency />
</template>
