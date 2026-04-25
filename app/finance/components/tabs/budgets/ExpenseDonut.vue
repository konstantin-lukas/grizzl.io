<script setup lang="ts">
import { Chart } from "chart.js";
import useLocale from "~/core/composables/useLocale";
import { useScreenSize } from "~/core/composables/useScreenSize";
import {
    COLOR_ELEVATED_DARK_MODE,
    COLOR_ELEVATED_LIGHT_MODE,
    COLOR_PRIMARY_DARK_MODE,
    COLOR_PRIMARY_LIGHT_MODE,
} from "~/core/constants/colors.constant";
import useCategories from "~/finance/composables/useCategories";
import type { PerMonthCategoryStatistics } from "~/finance/composables/usePerMonthTransactions";
import { formatCurrency } from "~/finance/utils/currency";

const { categories } = useCategories();
const { language } = useLocale();
const { sm } = useScreenSize();
const colorMode = useColorMode();
const props = defineProps<{ expenses: PerMonthCategoryStatistics[]; currency: string }>();
const canvasRef = ref();
const chart = shallowRef<Chart>();

const spentOverall = computed(() => {
    const amount = props.expenses.reduce((sum, { spent }) => sum + spent, 0);
    return formatCurrency(language.value, props.currency, amount);
});

const labels = computed(() =>
    props.expenses.map(({ category }) => {
        return categories.value.find(c => c.id === category)?.displayName ?? "";
    }),
);
const data = computed(() => props.expenses.map(({ spent }) => spent));
const dataColor = computed(() => (colorMode.value === "dark" ? COLOR_PRIMARY_DARK_MODE : COLOR_PRIMARY_LIGHT_MODE));
const borderColor = computed(() => (colorMode.value === "dark" ? COLOR_ELEVATED_DARK_MODE : COLOR_ELEVATED_LIGHT_MODE));
const borderWidth = computed(() => (sm.value ? 10 : 5));

onMounted(() => {
    chart.value = new Chart(canvasRef.value, {
        type: "doughnut",
        data: {
            labels: labels.value,
            datasets: [
                {
                    backgroundColor: dataColor.value,
                    borderColor: borderColor.value,
                    hoverBorderColor: borderColor.value,
                    borderWidth: borderWidth.value,
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

watch(
    [data, labels, dataColor, borderColor, borderWidth],
    ([newData, newLabels, newDataColor, newBorderColor, newBorderWidth]) => {
        if (!chart.value || import.meta.server) return;
        chart.value.data.labels = newLabels;
        chart.value.data.datasets[0]!.data = newData;
        chart.value.data.datasets[0]!.backgroundColor = newDataColor;
        chart.value.data.datasets[0]!.borderColor = newBorderColor;
        chart.value.data.datasets[0]!.hoverBorderColor = newBorderColor;
        chart.value.data.datasets[0]!.borderWidth = newBorderWidth;
        chart.value.update();
    },
);
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
