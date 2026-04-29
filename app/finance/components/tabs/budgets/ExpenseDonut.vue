<script setup lang="ts">
import { Chart } from "chart.js";
import useLocale from "~/core/composables/useLocale";
import {
    CHART_COLORS,
    COLOR_ELEVATED_DARK_MODE,
    COLOR_ELEVATED_LIGHT_MODE,
    COLOR_FRONT_DARK_MODE,
    COLOR_FRONT_LIGHT_MODE,
} from "~/core/constants/colors.constant";
import useCategories from "~/finance/composables/useCategories";
import type { PerMonthCategoryStatistics } from "~/finance/composables/usePerMonthTransactions";
import { formatCurrency } from "~/finance/utils/currency";

const { categories } = useCategories();
const { language } = useLocale();
const { t } = useI18n();
const colorMode = useColorMode();
const props = defineProps<{ expenses: PerMonthCategoryStatistics[]; currency: string }>();
const canvasRef = ref();
const chart = shallowRef<Chart>();

const spentOverall = computed(() => {
    const amount = props.expenses.reduce((sum, { spent }) => sum + spent, 0);
    if (amount === 0) {
        return t("finance.budgets.noExpenses");
    }
    return formatCurrency(language.value, props.currency, amount);
});

const labels = computed(() =>
    props.expenses.map(({ category }) => {
        return categories.value.find(c => c.id === category)?.displayName ?? "";
    }),
);
const data = computed(() => props.expenses.map(({ spent }) => spent));
const borderColor = computed(() => (colorMode.value === "dark" ? COLOR_ELEVATED_DARK_MODE : COLOR_ELEVATED_LIGHT_MODE));
const backgroundColor = computed(() => (colorMode.value === "dark" ? COLOR_FRONT_DARK_MODE : COLOR_FRONT_LIGHT_MODE));

onMounted(() => {
    chart.value = new Chart(canvasRef.value, {
        type: "pie",
        data: {
            labels: labels.value,
            datasets: [
                {
                    backgroundColor: CHART_COLORS,
                    borderColor: borderColor.value,
                    hoverBackgroundColor: backgroundColor.value,
                    borderWidth: 0,
                    data: data.value,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    displayColors: false,
                    callbacks: {
                        label(context) {
                            const value = context.parsed;
                            if (value === null) return "";
                            return formatCurrency(language.value, props.currency, value);
                        },
                    },
                },
            },
        },
    });
});

watch([data, labels, borderColor, backgroundColor], ([newData, newLabels, newBorderColor, newBackgroundColor]) => {
    if (!chart.value || import.meta.server) return;
    chart.value.data.labels = newLabels;
    chart.value.data.datasets[0]!.data = newData;
    chart.value.data.datasets[0]!.borderColor = newBorderColor;
    chart.value.data.datasets[0]!.hoverBackgroundColor = newBackgroundColor;
    chart.value.update();
});
</script>

<template>
    <div class="my-4 flex items-center rounded-xl bg-elevated px-8 py-6 not-md:flex-col md:px-12 md:py-8">
        <div class="relative z-1 aspect-square w-full max-w-96">
            <canvas ref="canvasRef" />
        </div>
        <div class="flex w-full justify-center">
            <ul class="flex w-full flex-wrap gap-4 not-md:mt-6 md:ml-10 md:flex-col">
                <li class="flex w-full items-center gap-2 border-b border-b-accented pb-3">
                    <b>{{ $t("finance.budgets.sumTotal") }}: </b>
                    <UBadge color="neutral">
                        {{ spentOverall }}
                    </UBadge>
                </li>
                <li v-for="(datum, index) in data" :key="index" class="flex items-center gap-2">
                    <span
                        :style="{ backgroundColor: CHART_COLORS[index] }"
                        class="inline-block size-4 shrink-0 rounded-full"
                    />
                    <span>
                        {{ labels[index] }}:
                        <UBadge color="neutral">{{ formatCurrency(language, props.currency, datum) }}</UBadge>
                    </span>
                </li>
            </ul>
        </div>
    </div>
</template>
