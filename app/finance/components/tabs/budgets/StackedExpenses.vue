<script setup lang="ts">
import { CalendarDate, getLocalTimeZone } from "@internationalized/date";
import { Chart } from "chart.js";
import useLocale from "~/core/composables/useLocale";
import useToday from "~/core/composables/useToday";
import { COLOR_PRIMARY_DARK_MODE, COLOR_PRIMARY_LIGHT_MODE } from "~/core/constants/colors.constant";
import useCategories from "~/finance/composables/useCategories";
import type { PerMonthCategoryStatistics } from "~/finance/composables/usePerMonthTransactions";
import { formatCurrency } from "~/finance/utils/currency";

const props = defineProps<{ expenses: PerMonthCategoryStatistics[][]; currency: string }>();

const colorMode = useColorMode();
const { language } = useLocale();
const { categories } = useCategories();
const { today } = useToday();

const getMonthName = (month: number, variant: "short" | "long" = "short") => {
    const timeZone = getLocalTimeZone();
    const date = new CalendarDate(2020, month, 15);
    return new Intl.DateTimeFormat(language.value, { month: variant, timeZone }).format(date.toDate(timeZone));
};

const canvasRef = ref();
const chart = shallowRef<Chart>();
const dataColor = computed(() => (colorMode.value === "dark" ? COLOR_PRIMARY_DARK_MODE : COLOR_PRIMARY_LIGHT_MODE));
const monthNumbers = computed(() =>
    Array.from({ length: 12 }).map((_, i) => {
        const offset = today.value?.month ?? 0;
        const month = i + 1;
        const effectiveMonth = month + offset;
        return effectiveMonth % 12;
    }),
);
const monthNames = computed(() => {
    return monthNumbers.value.map(i => getMonthName(i));
});
const longMonthNames = computed(() => {
    return monthNumbers.value.map(i => getMonthName(i, "long"));
});
const datasets = computed(() => {
    const allExpenses = props.expenses.flat();
    const categoryIds = [...new Set(allExpenses.map(({ category }) => category))];
    return categoryIds.map(categoryId => {
        const categoryName = categories.value.find(({ id }) => id === categoryId)?.displayName;
        const categoryExpenses = props.expenses.map(expense => expense.find(item => item.category === categoryId));
        const categoryData = categoryExpenses.map(expense => expense?.spent ?? 0);

        return {
            label: categoryName,
            data: categoryData,
            backgroundColor: dataColor.value,
            borderRadius: 10,
        };
    });
});

onMounted(() => {
    chart.value = new Chart(canvasRef.value, {
        type: "bar",
        data: {
            labels: monthNames.value,
            datasets: datasets.value,
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                    ticks: {
                        display: false,
                    },
                },
            },
            plugins: {
                tooltip: {
                    displayColors: false,
                    titleMarginBottom: 0,
                    padding: 10,
                    callbacks: {
                        label(context) {
                            const value = context.parsed.y;
                            return formatCurrency(language.value, props.currency, value);
                        },
                        title(context) {
                            const month = context[0]?.dataIndex ?? 0;
                            return longMonthNames.value[month];
                        },
                    },
                },
            },
        },
    });
});
</script>

<template>
    <div class="mt-4 rounded-xl bg-elevated p-6">
        <div class="h-[60dvh] max-h-80 portrait:h-[40dvh]">
            <canvas ref="canvasRef" />
        </div>
    </div>
</template>
