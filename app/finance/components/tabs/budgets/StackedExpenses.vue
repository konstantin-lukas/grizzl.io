<script setup lang="ts">
import { CalendarDate, getLocalTimeZone } from "@internationalized/date";
import useLocale from "~/core/composables/useLocale";
import useToday from "~/core/composables/useToday";
import useCategories from "~/finance/composables/useCategories";
import type { PerMonthCategoryStatistics } from "~/finance/composables/usePerMonthTransactions";
import { formatCurrency } from "~/finance/utils/currency";
import BarChart from "~/core/components/chart/BarChart.vue";

const props = defineProps<{ expenses: PerMonthCategoryStatistics[][]; currency: string }>();

const { language } = useLocale();
const { categories } = useCategories();
const { today } = useToday();

const getMonthName = (month: number, variant: "short" | "long" = "short") => {
    const timeZone = getLocalTimeZone();
    const date = new CalendarDate(2020, month, 15);
    return new Intl.DateTimeFormat(language.value, { month: variant, timeZone }).format(date.toDate(timeZone));
};

const monthNumbers = computed(() =>
    Array.from({ length: 12 }).map((_, i) => {
        const offset = today.value?.month ?? 0;
        const effectiveMonth = i + offset;
        const moduloMonth = effectiveMonth % 12;
        return moduloMonth + 1;
    }),
);
const monthNames = computed(() => {
    return monthNumbers.value.map(i => getMonthName(i));
});
const datasets = computed(() => {
    const allExpenses = props.expenses.flat();
    const categoryIds = [...new Set(allExpenses.map(({ category }) => category))].sort((a, b) => {
        const aDisplayName = categories.value.find(c => c.id === a)?.displayName ?? "";
        const bDisplayName = categories.value.find(c => c.id === b)?.displayName ?? "";
        return aDisplayName.localeCompare(bDisplayName);
    });
    return categoryIds.map(categoryId => {
        const categoryName = categories.value.find(({ id }) => id === categoryId)?.displayName;
        const categoryExpenses = props.expenses.map(expense => expense.find(item => item.category === categoryId));
        const categoryData = categoryExpenses.map(expense => expense?.spent ?? 0);

        return {
            label: categoryName,
            data: categoryData,
        };
    });
});
</script>

<template>
    <div class="mt-4 rounded-xl bg-elevated p-8 pb-4" data-test-id="finance-previous-expenses-chart">
        <div class="h-[60dvh] sm:max-h-80 portrait:h-[75dvh]">
            <BarChart
                :datasets
                :labels="monthNames"
                :tooltip-label-callback="value => formatCurrency(language, currency, value)"
            />
        </div>
    </div>
</template>
