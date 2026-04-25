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
        type: "doughnut",
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
            cutout: "61.8%",
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
    <div class="my-4 rounded-xl bg-elevated p-4 xs:p-6">
        <div class="relative z-1 mx-auto aspect-square max-w-96">
            <canvas ref="canvasRef" />
            <UBadge class="absolute top-1/2 left-1/2 -z-1 -translate-1/2" color="neutral">
                {{ spentOverall }}
            </UBadge>
        </div>
    </div>
</template>
