<script setup lang="ts">
import { CalendarDate, getLocalTimeZone } from "@internationalized/date";
import { Chart } from "chart.js";
import useLocale from "~/core/composables/useLocale";
import { useScreenSize } from "~/core/composables/useScreenSize";
import useToday from "~/core/composables/useToday";
import { CHART_COLORS, COLOR_FRONT_DARK_MODE, COLOR_FRONT_LIGHT_MODE } from "~/core/constants/colors.constant";
import useCategories from "~/finance/composables/useCategories";
import type { PerMonthCategoryStatistics } from "~/finance/composables/usePerMonthTransactions";
import { formatCurrency } from "~/finance/utils/currency";

const props = defineProps<{ expenses: PerMonthCategoryStatistics[][]; currency: string }>();

const colorMode = useColorMode();
const { language } = useLocale();
const { categories } = useCategories();
const { today } = useToday();
const { sm } = useScreenSize();

const getMonthName = (month: number, variant: "short" | "long" = "short") => {
    const timeZone = getLocalTimeZone();
    const date = new CalendarDate(2020, month, 15);
    return new Intl.DateTimeFormat(language.value, { month: variant, timeZone }).format(date.toDate(timeZone));
};

const canvasRef = ref();
const chart = shallowRef<Chart>();
const gridColor = computed(() => (colorMode.value === "dark" ? COLOR_FRONT_DARK_MODE : COLOR_FRONT_LIGHT_MODE));
const backgroundColor = computed(() => (colorMode.value === "dark" ? COLOR_FRONT_DARK_MODE : COLOR_FRONT_LIGHT_MODE));
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
    const categoryIds = [...new Set(allExpenses.map(({ category }) => category))];
    return categoryIds.map((categoryId, i) => {
        const categoryName = categories.value.find(({ id }) => id === categoryId)?.displayName;
        const categoryExpenses = props.expenses.map(expense => expense.find(item => item.category === categoryId));
        const categoryData = categoryExpenses.map(expense => expense?.spent ?? 0);
        const color = CHART_COLORS[i % CHART_COLORS.length];

        return {
            label: categoryName,
            data: categoryData,
            backgroundColor: color,
            hoverBackgroundColor: backgroundColor.value,
            borderRadius: {
                topLeft: 8,
                topRight: 8,
                bottomLeft: 8,
                bottomRight: 8,
            },
            borderSkipped: false,
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
            indexAxis: sm.value ? "x" : "y",
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: sm.value ? "category" : "linear",
                    stacked: true,
                    grid: {
                        color: "rgba(255,255,255,0)",
                    },
                    ticks: {
                        display: sm.value,
                        color: gridColor.value,
                        padding: 10,
                    },
                },
                y: {
                    type: sm.value ? "linear" : "category",
                    stacked: true,
                    grid: {
                        color: gridColor.value,
                    },
                    ticks: {
                        display: !sm.value,
                        color: gridColor.value,
                        padding: 10,
                    },
                    border: {
                        width: 0,
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
                            const value = context.parsed[sm.value ? "y" : "x"] ?? 0;
                            return formatCurrency(language.value, props.currency, value);
                        },
                        title(context) {
                            return context[0]?.dataset.label;
                        },
                    },
                },
            },
        },
    });
});

watch([datasets, monthNames, gridColor, sm], ([newDatasets, newMonthNames, newGridColor, newSm]) => {
    if (!chart.value || import.meta.server) return;

    chart.value.data.datasets = newDatasets;
    chart.value.data.labels = newMonthNames;

    chart.value.options.indexAxis = newSm ? "x" : "y";

    chart.value.options.scales!.x = {
        type: newSm ? "category" : "linear",
        stacked: true,
        grid: {
            color: "rgba(255,255,255,0)",
        },
        ticks: {
            display: newSm,
            color: newGridColor,
            padding: 10,
        },
    };

    chart.value.options.scales!.y = {
        type: newSm ? "linear" : "category",
        stacked: true,
        grid: {
            color: newGridColor,
        },
        ticks: {
            display: !newSm,
            color: newGridColor,
            padding: 10,
        },
        border: {
            width: 0,
        },
    };

    chart.value.update();
});
</script>

<template>
    <div class="mt-4 rounded-xl bg-elevated p-8 pb-4" data-test-id="finance-previous-expenses-chart">
        <div class="h-[60dvh] sm:max-h-80 portrait:h-[75dvh]">
            <canvas ref="canvasRef" />
        </div>
    </div>
</template>
