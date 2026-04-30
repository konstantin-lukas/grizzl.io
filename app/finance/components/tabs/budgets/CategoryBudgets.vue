<script setup lang="ts">
import { CalendarDate } from "@internationalized/date";
import useToday from "~/core/composables/useToday";
import CategoryBudgetProgress from "~/finance/components/tabs/budgets/CategoryBudgetProgress.vue";
import CategoryBudgetProgressSkeleton from "~/finance/components/tabs/budgets/CategoryBudgetProgressSkeleton.vue";
import useAutoTransactions from "~/finance/composables/useAutoTransactions";
import type { PerMonthCategoryStatistics } from "~/finance/composables/usePerMonthTransactions";

const { autoTransactions, isFetching: isFetchingAutoTransactions } = useAutoTransactions();
const { today } = useToday();

const props = defineProps<{ expenses: PerMonthCategoryStatistics[]; currency: string; isFetching: boolean }>();

const expandedExpenses = computed(() => {
    const copy = [...props.expenses.map(item => ({ ...item, budget: 0 }))];
    const relevantAutoTransactions = autoTransactions.value.filter(autoTransaction => {
        if (autoTransaction.amount < 0 || !today.value) return false;
        const lastExecDate = new CalendarDate(
            ...(autoTransaction.lastExec.split("-").map(Number) as [number, number, number]),
        );
        const nextExecDate = lastExecDate
            .add({ months: autoTransaction.execInterval })
            .set({ day: autoTransaction.execOn });

        const wasExecutedThisMonth =
            lastExecDate.month === today.value!.month && lastExecDate.year === today.value!.year;
        const willBeExecutedThisMonth =
            nextExecDate.month === today.value!.month && nextExecDate.year === today.value!.year;

        return wasExecutedThisMonth || willBeExecutedThisMonth;
    });

    for (const relevantAutoTransaction of relevantAutoTransactions) {
        const statisticsItem = copy.find(item => item.category === relevantAutoTransaction.category.id);
        if (statisticsItem) {
            statisticsItem.budget += relevantAutoTransaction.amount;
        } else {
            copy.push({
                spent: 0,
                budget: relevantAutoTransaction.amount,
                category: relevantAutoTransaction.category.id,
                change: 0,
            });
        }
    }

    return copy;
});
</script>

<template>
    <div class="mt-4 grid grid-cols-[1fr_1fr] gap-x-6 gap-y-12 sm:grid-cols-[1fr_1fr_1fr] sm:gap-12">
        <div v-for="expense in expandedExpenses" :key="expense.category">
            <CategoryBudgetProgressSkeleton v-if="isFetchingAutoTransactions || props.isFetching" />
            <CategoryBudgetProgress v-else :expense="expense" :currency="props.currency" />
        </div>
    </div>
</template>
