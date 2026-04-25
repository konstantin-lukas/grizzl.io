<script setup lang="ts">
import CategoryBudgetProgress from "~/finance/components/tabs/budgets/CategoryBudgetProgress.vue";
import type { PerMonthCategoryStatistics } from "~/finance/composables/usePerMonthTransactions";

const props = defineProps<{ expenses: PerMonthCategoryStatistics[]; currency: string }>();
</script>

<template>
    <div class="mt-4 grid grid-cols-[1fr_1fr] gap-x-6 gap-y-12 sm:grid-cols-[1fr_1fr_1fr] sm:gap-12">
        <CategoryBudgetProgress
            v-for="expense in props.expenses"
            :key="expense.category"
            :expense="expense"
            :currency="props.currency"
        />
    </div>
</template>
